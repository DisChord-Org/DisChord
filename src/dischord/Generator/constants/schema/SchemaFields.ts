import { FieldKind, FieldSpec } from "../../../../chord/BDOSchema";

/**
 * The two kinds of field most blocks are made of: a value that passes through as it is, optional or required.
 */
export class SchemaFields {
    /**
     * An optional field that passes its value through as it is.
     * @param {string} key - The property's key inside the BDO.
     * @param {string} defaultValue - The JS expression substituted when the field is absent.
     * @returns {FieldSpec} The field.
     */
    public static value (key: string, defaultValue: string): FieldSpec {
        return { key, kind: FieldKind.Value, default: defaultValue };
    }

    /**
     * A field that must be present and passes its value through as it is.
     * @param {string} key - The property's key inside the BDO.
     * @param {string} missingMessage - The message when the field is absent.
     * @returns {FieldSpec} The field.
     */
    public static required (key: string, missingMessage: string): FieldSpec {
        return { key, kind: FieldKind.Value, required: true, missingMessage };
    }
}
