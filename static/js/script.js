document.addEventListener('DOMContentLoaded', () => {
    const passwordOutput = document.getElementById('password-output');
    const lengthSlider = document.getElementById('length-slider');
    const lengthVal = document.getElementById('length-val');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const strengthFill = document.getElementById('strength-fill');
    const strengthLabel = document.getElementById('strength-label');
    const toast = document.getElementById('toast');

    // Update length display
    lengthSlider.addEventListener('input', () => {
        lengthVal.textContent = lengthSlider.value;
    });

    // Generate Password
    const generatePassword = async () => {
        const length = parseInt(lengthSlider.value);
        
        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ length }),
            });

            const data = await response.json();
            
            passwordOutput.value = data.password;
            updateStrengthMeter(data.strength);
        } catch (error) {
            console.error('Error generating password:', error);
        }
    };

    const updateStrengthMeter = (strength) => {
        // Remove all strength classes
        strengthFill.className = 'fill';
        strengthFill.classList.add(`strength-${strength.score}`);
        
        strengthLabel.textContent = `Strength: ${strength.label}`;
        
        // Color update for label
        if (strength.score <= 1) strengthLabel.style.color = '#ef4444';
        else if (strength.score === 2) strengthLabel.style.color = '#f59e0b';
        else strengthLabel.style.color = '#22c55e';
    };

    // Copy to clipboard
    const copyToClipboard = () => {
        const password = passwordOutput.value;
        if (!password) return;

        navigator.clipboard.writeText(password).then(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        });
    };

    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyToClipboard);

    // Initial generation
    generatePassword();
});
