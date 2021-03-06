import IField from "../../Field/IField";
import {FormTestUtils} from "../../TestingUtils/FormTestUtils";
import {FieldType} from "../../Field/Concrete/FieldType";
import {IFieldValue} from "../../Field/Value/FieldValue";
import {mock} from "jest-mock-extended";
import {IFieldUI} from "../../Field/UI/FieldUI";
import {IFieldValidation} from "../../Field/Validation/FieldValidation";
import {FieldValidationConfiguration} from "../../Field/Validation/FieldValidationConfiguration";
import {IFieldEvent} from "../../Field/FieldEvent/FieldEvent";
import DefaultFieldChangeHandler from "../../ChangeHandler/DefaultFieldChangeHandler";
import {FieldEvents, GlobalEvents} from "../../Event/DefaultEvents";

describe("DefaultFieldChangeHandler", () => {

    function createField(mockedSet: any, readonly: boolean = false, disabled: boolean = false, skipValidation: boolean = false, validateOnChange: boolean = true, fieldEvent: IFieldEvent = mock<IFieldEvent>()): IField {
        return FormTestUtils.createMockedField('X', FieldType.NORMAL, {
            value: () => mock<IFieldValue>({
                set: mockedSet,
                extractFromEvent: e => e,
            }),
            ui: () => mock<IFieldUI>({
                isReadonly(): boolean {
                    return readonly;
                },
                shouldDisable(): boolean {
                    return disabled;
                }
            }),
            validation: () => mock<IFieldValidation>({
                config(key: keyof FieldValidationConfiguration): any {
                    if (key === "skipValidation") return skipValidation;
                    if (key === "validateOnChange") return validateOnChange;
                }
            }),
            event: () => fieldEvent
        });
    }

    it('should not change field when field read only', function () {
        const mockedSet = jest.fn();
        const field = createField(mockedSet, true);
        const changeHandler = new DefaultFieldChangeHandler(field);
        changeHandler.handle('value');
        expect(mockedSet).not.toBeCalled();
    });

    it('should not change field when field disabled', function () {
        const mockedSet = jest.fn();
        const field = createField(mockedSet, false, true);
        const changeHandler = new DefaultFieldChangeHandler(field);
        changeHandler.handle('value');
        expect(mockedSet).not.toBeCalled();
    });

    it('should change value', function () {
        const mockedSet = jest.fn();
        const field = createField(mockedSet);
        const changeHandler = new DefaultFieldChangeHandler(field);
        changeHandler.handle('value');
        expect(mockedSet).toBeCalledWith('value', true, expect.any(Function));
    });

    it('should not validate after change only when not skipped validation and set to be validated', function () {
        const mockedSet = jest.fn();

        function _test(skip: boolean, validateOnChange: boolean, expected: boolean) {
            const field = createField(mockedSet, false, false, skip, validateOnChange);
            const changeHandler = new DefaultFieldChangeHandler(field);
            changeHandler.handle('value');
            expect(mockedSet).toBeCalledWith('value', expected, expect.any(Function));
        }

        _test(true, false, false);
        _test(false, false, false);
        _test(true, true, false);
        _test(false, true, true);
    });


    it('should emit events', function () {
        const mockedSet = (_: any, __: any, callback: any) => {
            callback();
        }
        const mockedEvent = mock<IFieldEvent>();
        const field = createField(mockedSet, false, false, false, false, mockedEvent);
        const changeHandler = new DefaultFieldChangeHandler(field);
        changeHandler.handle('value');
        expect(mockedEvent.emitOnThis).toBeCalledWith(FieldEvents.CHANGE, {});
        expect(mockedEvent.emit).toBeCalledWith(GlobalEvents.VALUE_CHANGED, {field: field});
    });

});