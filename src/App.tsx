import React from 'react';
import Form from "./Form/Concrate/Form";
import Validator from "./Protocol/Validator";
import Submitter from "./Protocol/Submitter";
import IForm from "./Form/IForm";
import TextField from "./DefaultElement/TextField";
import PasswordField from "./DefaultElement/PasswordField";
import DynamicTextField from "./DefaultElement/DynamicTextField";

class ThreeCharLengthValidator implements Validator {
    validate(value: any, validationRules: any): boolean | string {
        const isValid = value && value.length === 3;
        if (isValid === true) return true;

        if (value && value.length > 3)
            return 'too long';
        else if (value && value.length < 3)
            return 'too short';

        return false;
    }
}


class DummySubmitter implements Submitter {
    private readonly form: IForm;

    constructor(form: IForm) {
        this.form = form;
    }

    getForm(): IForm {
        return this.form;
    }

    submit(): void {
        const collectedData = this.getForm().collect();
        console.log('data : ', collectedData.getData());
        console.log('queries : ', collectedData.getQuery());
        console.log('files : ', collectedData.getFiles());
    }
}

function App() {
    return (
        <div>
            <h3>EXAMPLE</h3>
            <Form fields={[
                {as: TextField, name: 'username', label: 'Username'},
                {as: PasswordField, name: 'password', label: 'Password'},
                {as: DynamicTextField, name: 'phone', label: 'Phone', asQuery: true},
                {
                    as: DynamicTextField,
                    name: 'email',
                    label: 'Email',
                    maxInputs: 2,
                    onMaxInputExceeded: (field: any) => {
                        console.log(field);
                    }
                }

            ]} services={{
                validator: () => new ThreeCharLengthValidator(),
                submitter: form => new DummySubmitter(form)
            }}
            />
        </div>
    );
}

export default App;