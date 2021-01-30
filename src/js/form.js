function validateInput(elInput, labelName, errorTxt) {
    console.log('labelName:', labelName)
    var inputValue = elInput.value;
    if (inputValue === '') {
        var elTodoLabel = document.querySelector(`.${labelName}-label`);
        console.log('elTodoLabel:', elTodoLabel);
        var elTodoLabelTxt = elTodoLabel.innerText;
        setElAttr(elInput, elTodoLabel, errorTxt);

        setTimeout(function () {
            setElAttr(elInput, elTodoLabel, elTodoLabelTxt, false);
        }, 1000);

        return false;
    }

    return inputValue;
}

function setElAttr(input, label, txt, markTrueOrFalse = true) {
    // just being cute :)
    var toggle = markTrueOrFalse ? 'add' : 'remove';
    input.classList[toggle]('wrong-input');
    label.classList[toggle]('wrong-label');

    label.innerText = txt;
}
