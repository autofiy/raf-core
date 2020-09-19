import {EventCallback} from "../../Event/EventType";
import IField from "../IField";

export interface IFieldEvent {

    listen(eventName: string, callback: EventCallback): void;

    listenOnThis(eventName: string, callback: EventCallback): void;

    removeListener(eventName: string): void;

    removeListenerOnThis(eventName: string): void;

    emit(eventName: string, payload: any): void;

    emitOnThis(eventName: string, payload: any): void;

    makeEventName(type: string): string;
}

export class FieldEvent implements IFieldEvent {

    private readonly field: IField;

    constructor(field: IField) {
        this.field = field;
    }

    emit(eventName: string, payload: any): void {
        let defaultPayload = this.getDefaultPayload();
        const _payload = {...defaultPayload, ...payload}
        this.field.getForm().event().emit(eventName, _payload);
    }

    private getDefaultPayload(): any {
        return {__source: this.field};
    }

    emitOnThis(eventName: string, payload: any): void {
        const name = this.makeEventName(eventName);
        this.emit(name, payload);
    }

    listen(eventName: string, callback: EventCallback): void {
        this.field.getForm().event().addListener(this.field.getName(), eventName, callback);
    }

    listenOnThis(eventName: string, callback: EventCallback): void {
        const name = this.makeEventName(eventName);
        this.listen(name, callback);
    }

    removeListener(eventName: string): void {
        this.field.getForm().event().removeListener(this.field.getName(), eventName);
    }

    removeListenerOnThis(eventName: string): void {
        const name = this.makeEventName(eventName);
        this.removeListener(name);
    }
    
    makeEventName(type: string): string {
        return this.field.getProps().injectedEventNameMaker.fieldEvent(this.field, type);
    }

}