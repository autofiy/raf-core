import FieldChangeHandler from "../protocol/FieldChangeHandler";
import IField from "../field/IField";

export default class DefaultFieldChangeHandler implements FieldChangeHandler {
    private readonly field: IField;

    constructor(field: IField) {
        this.field = field;
    }

    getField(): IField {
        return this.field;
    }

    handle(): void {
        //TODO : implementation
    }

}