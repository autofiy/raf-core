import FormRenderer from "../Protocol/FormRenderer";
import IForm from "../Form/IForm";
import * as React from "react";
import {getFormService} from "../Form/FormService";
import FieldRenderer from "../Protocol/FieldRenderer";
import FormDefault from "../Form/FormDefault";

export class DefaultFormRenderer implements FormRenderer {

    private readonly form: IForm;

    constructor(form: IForm) {
        this.form = form;
    }

    getForm(): IForm {
        return this.form;
    }

    render(): any {
        const fields = this.renderFields();
        return <div>
            {fields}
            <br/>
            <button onClick={() => this.getForm().submit()}>SUBMIT</button>
        </div>
    }


    protected renderFields(): any {
        const renderer = getFormService<FieldRenderer>("field renderer", this.form, this.form.getProps().services?.fieldRenderer, FormDefault.getFieldRenderer());
        return renderer.render();
    }

}
