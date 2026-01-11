// @ts-nocheck
declare const acquireVsCodeApi: any;
declare const htmlToImage: any;

export function webviewScript() {
    'use strict';

    const vscode = acquireVsCodeApi();
    const container = document.getElementById('snap-container')!;
    const codeContent = document.getElementById('code-content')!;
    const savedPresetsContainer = document.getElementById('saved-presets')!;
    
    const color1Input = document.getElementById('color1') as HTMLInputElement;
    const color2Input = document.getElementById('color2') as HTMLInputElement;
    const angleInput = document.getElementById('angle') as HTMLInputElement;
    const angleVal = document.getElementById('angle-val')!;
    const macHeaderToggle = document.getElementById('mac-header-toggle') as HTMLInputElement;
    const titleBar = document.querySelector('.title-bar') as HTMLElement;

    /**
     * Renders the list of presets
     * @param {Array} presets - List of presets
     */
    function renderSavedPresets(presets: any[]) {
        savedPresetsContainer.innerHTML = '';
        if (!presets || presets.length === 0) {
            savedPresetsContainer.innerHTML = '<span style="font-size: 11px; color: #666; font-style: italic;">No presets</span>';
            return;
        }

        presets.forEach(preset => {
            const wrapper = document.createElement('div');
            wrapper.className = 'preset-wrapper';

            const btn = document.createElement('button');
            btn.className = 'preset-button';
            btn.style.width = '100%';
            btn.style.background = `linear-gradient(${preset.angle}deg, ${preset.color1}, ${preset.color2})`;
            
            // Tooltip requirement
            btn.title = `${preset.label || 'Saved'}: ${preset.color1} -> ${preset.color2} @ ${preset.angle}° ${preset.showMacHeader ? '(with header)' : ''}`;
            
            btn.setAttribute('data-c1', preset.color1);
            btn.setAttribute('data-c2', preset.color2);
            btn.setAttribute('data-angle', preset.angle);
            btn.setAttribute('data-machdr', !!preset.showMacHeader);
            
            // Mini-header requirement
            if (preset.showMacHeader) {
                const miniHeader = document.createElement('div');
                miniHeader.className = 'mini-header';
                miniHeader.innerHTML = '<div class="mini-dot"></div><div class="mini-dot"></div><div class="mini-dot"></div>';
                btn.appendChild(miniHeader);
            }

            btn.onclick = () => {
                color1Input.value = preset.color1;
                color2Input.value = preset.color2;
                angleInput.value = preset.angle.toString();
                macHeaderToggle.checked = !!preset.showMacHeader;
                updateGradient();
            };
            
            wrapper.appendChild(btn);

            // Only show remove button for non-default presets
            if (!preset.isDefault) {
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.innerHTML = '🗙';
                removeBtn.title = 'Remove Preset';
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    showRemoveModal(preset);
                };
                wrapper.appendChild(removeBtn);
            }

            savedPresetsContainer.appendChild(wrapper);
        });
        updatePresetState();
    }

    // Initialize saved presets from injected global
    if ((window as any).initialPresets) {
        renderSavedPresets((window as any).initialPresets);
    }

    // Listen for messages from extension
    window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'updateConfigurations') {
            renderSavedPresets(message.data);
        } else if (message.command === 'triggerPaste') {
            codeContent.focus();
            document.execCommand('paste');
            vscode.postMessage({ command: 'pasteDone' });
        }
    });

    let debounceTimer: NodeJS.Timeout;

    /**
     * Persists the current gradient state to the extension (debounced)
     */
    function persistState() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            vscode.postMessage({
                command: 'persistState',
                data: {
                    color1: color1Input.value,
                    color2: color2Input.value,
                    angle: parseInt(angleInput.value),
                    showMacHeader: macHeaderToggle.checked
                }
            });
        }, 500);
    }

    /**
     * Updates the gradient background based on current input values
     */
    function updateGradient() {
        const c1 = color1Input.value;
        const c2 = color2Input.value;
        const ang = angleInput.value;
        const showHdr = macHeaderToggle.checked;

        angleVal.innerText = ang + '°';
        container.style.background = `linear-gradient(${ang}deg, ${c1}, ${c2})`;
        titleBar.style.display = showHdr ? 'flex' : 'none';

        updatePresetState();
        persistState();
    }

    function updatePresetState() {
        const c1 = color1Input.value;
        const c2 = color2Input.value;
        const ang = angleInput.value;
        const showHdr = macHeaderToggle.checked;

        document.querySelectorAll('.preset-button').forEach(btn => {
            const btnC1 = btn.getAttribute('data-c1');
            const btnC2 = btn.getAttribute('data-c2');
            const btnAngle = btn.getAttribute('data-angle');
            const btnHdr = btn.getAttribute('data-machdr') === 'true';

            if (btnC1 === c1 && btnC2 === c2 && btnAngle === ang && btnHdr === showHdr) {
                btn.classList.add('active');
                (btn as HTMLButtonElement).disabled = true;
            } else {
                btn.classList.remove('active');
                (btn as HTMLButtonElement).disabled = false;
            }
        });
    }

    // Add event listeners for gradient controls
    [color1Input, color2Input, angleInput, macHeaderToggle].forEach(el => {
        el.addEventListener('input', updateGradient);
    });

    // Handle preset buttons
    document.querySelectorAll('.preset-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const c1 = btn.getAttribute('data-c1');
            const c2 = btn.getAttribute('data-c2');
            const ang = btn.getAttribute('data-angle');
            const hdr = btn.getAttribute('data-machdr') === 'true';
            
            if (c1 && c2 && ang) {
                color1Input.value = c1;
                color2Input.value = c2;
                angleInput.value = ang;
                macHeaderToggle.checked = hdr;
                updateGradient();
            }
        });
    });

    // Handle paste event to insert code
    codeContent.addEventListener('paste', (e) => {
        e.preventDefault();
        const html = e.clipboardData!.getData('text/html');
        if (html) {
            codeContent.innerHTML = html;
            const wrapper = codeContent.querySelector('div');
            if (wrapper && wrapper.style.backgroundColor) {
                (document.querySelector('.window') as HTMLElement).style.backgroundColor = wrapper.style.backgroundColor;
            }
        }
    });

    // Handle snapshot export
    document.getElementById('snap-btn')!.addEventListener('click', () => {
        window.getSelection()!.removeAllRanges();
        htmlToImage.toPng(container).then((dataUrl: string) => {
            vscode.postMessage({ command: 'saveImage', data: dataUrl });
        }).catch((err: any) => {
            console.error('Failed to generate image:', err);
        });
    });

    // Handle Save Configuration
    document.getElementById('save-config-btn')!.addEventListener('click', () => {
        const config = {
            color1: color1Input.value,
            color2: color2Input.value,
            angle: parseInt(angleInput.value),
            showMacHeader: macHeaderToggle.checked
        };
        vscode.postMessage({ command: 'saveConfiguration', data: config });
    });

    // Remove Modal Logic
    const dialog = document.getElementById('confirm-dialog') as any; // HTMLDialogElement
    const confirmBtn = document.getElementById('confirm-remove')!;
    const cancelBtn = document.getElementById('cancel-remove')!;
    let presetToRemove: any = null;

    function showRemoveModal(preset: any) {
        presetToRemove = preset;
        dialog.showModal();
    }

    cancelBtn.addEventListener('click', () => {
        dialog.close();
        presetToRemove = null;
    });

    confirmBtn.addEventListener('click', () => {
        if (presetToRemove) {
            vscode.postMessage({ command: 'removeConfiguration', data: presetToRemove });
            dialog.close();
            presetToRemove = null;
        }
    });

    // Initial check
    setTimeout(updatePresetState, 100);
}
