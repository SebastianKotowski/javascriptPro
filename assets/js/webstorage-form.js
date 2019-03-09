(function() {

    function FormSaver(form) {

        this.form = form;
        this.fields = this.form.querySelectorAll("[name]:not([type='submit'])");
        this.formId = this.form.getAttribute("id");
        this.fieldsValues = {};

        this.loadFieldsValues();
        this.addSavingToFields();

        this.form.onsubmit = this.clearLocalStorage.bind(this);
    }

    FormSaver.prototype.loadFieldsValues = function() {

        var savedFields = window.localStorage[this.formId];

        if(savedFields) {
            savedFields = JSON.parse(savedFields);

            for(var key in savedFields) {
                this.form.querySelector("[name='" + key + "'").value = savedFields[key];
            }
        }
    }

    FormSaver.prototype.addSavingToFields = function() {

        for(var i = 0; i < this.fields.length; i++) {
            this.fields[i].onchange = this.saveField.bind(this);
        }
    }

    FormSaver.prototype.saveField = function(e) {

        var that = e.target;
        this.fieldsValues[that.getAttribute("name")] = that.value;

        this.saveToLocalStorage();
    }

    FormSaver.prototype.saveToLocalStorage = function() {

        window.localStorage.setItem(this.formId, JSON.stringify(this.fieldsValues));
    }

    FormSaver.prototype.clearLocalStorage = function(e) {

        e.preventDefault();

        window.localStorage.removeItem(this.formId);
    }

    if("localStorage" in window) {
        var formToSave = new FormSaver(document.querySelector("#form"));
    }

})();