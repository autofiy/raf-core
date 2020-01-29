import { FieldProps } from "../Field/FieldProps";
import FileField from "../Field/FileField";
interface Props extends FieldProps {
    label?: string;
}
export default class TextField extends FileField<Props> {
    render(): any;
    extractValueFromChangeEvent(event: any): any;
}
export {};