import { checkSchema } from "express-validator";

export default checkSchema(
    {
        q: {
            trim: true,
            customSanitizer: {
                options: (value: unknown) => {
                    return value ? value : "";
                },
            },
        },
        role: {
            customSanitizer: {
                options: (value: unknown) => {
                    return value ? value : "";
                },
            },
        },
        currentPage: {
            customSanitizer: {
                options: (value) => {
                    // 2, '2', undefined, 'sdlkfkjds' -> NaN
                    const parsedValue = Number(value);
                    return Number.isNaN(parsedValue) ? 1 : parsedValue;
                },
            },
        },
        perPage: {
            customSanitizer: {
                options: (value) => {
                    // 2, '2', undefined, 'sdlkfkjds' -> NaN
                    const parsedValue = Number(value);
                    return Number.isNaN(parsedValue) ? 6 : parsedValue;
                },
            },
        },
    },
    ["query"],
);


// ["query"]
// This tells checkSchema to only look at req.query for all these fields.

// These are all URL query parameters like:


// /users?q=John&role=admin&currentPage=2&perPage=10


//            +----------------------------+
// Query Param|     Default / Sanitizer   |
// ===========+============================+
//     q      | trim + default to ""       |
//     role   | default to ""              |
// currentPage| parse number, default to 1 |
//  perPage   | parse number, default to 6 |
