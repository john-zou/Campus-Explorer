import { invalid } from "./QueryPipeline";

/**
 * Used for checking multiple ID error
 * The ID can only be set once; the check function checks the ID if set, or sets it if not.
 * If the ID is set, then it is a valid ID
 */
export class IDHolder {
    private isSet: boolean = false;
    private id: string;

    public check = (id: string): void => {
        if (this.isSet) {
            // Check the ID
            if (this.id !== id) {
                invalid("Multiple IDs");
            }
        } else {
            // Set the ID
            this.isSet = true;
            this.id = id;
        }
    }

    /**
     * @returns the ID held
     */
    public get = (): string => {
        return this.id;
    }
}
