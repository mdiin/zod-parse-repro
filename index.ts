import { z } from "zod";

/*
 * Construct an object schema with a refinement on an array.
 */
const schema = z.object({
    foo: z.array(
        z.object({
            k1: z.string(),
            k2: z.number()
        })
    ).refine(
        (os) => os.filter((o) => o.k1 === "bar").length < 2,
        "At most one k1 with value \"bar\" allowed!"
    )
});

/**
 * Value that fails both the nested object's value type schema and
 * the top-level object's refinement on `foo`.
 */
const badValue1 = {
    foo: [
        { k1: "foo", k2: "42" },
        { k1: "bar", k2: 24 },
        { k1: "bar", k2: 11 }
    ]
}

const bad1 = schema.safeParse(badValue1);

// Expect this to print an object with two issues, but it does not:
console.log("badValue1 parsed", JSON.stringify(bad1, null, 2));

/**
 * Value that only fails the top-level object's refinement on `foo`.
 */
const badValue2 = {
    foo: [
        { k1: "foo", k2: 42 },
        { k1: "bar", k2: 24 },
        { k1: "bar", k2: 11 }
    ]
}

const bad2 = schema.safeParse(badValue2);

// Expect this to print an object with one issue, i.e. the "At most one k1 with value \"bar\" allowed!" message,
// and it does.
console.log("badValue2 parsed", JSON.stringify(bad2, null, 2));

/**
 * For reference: A value that fulfills the schema requirements
 */
const goodValue = {
    foo: [
        { k1: "foo", k2: 42 },
        { k1: "bar", k2: 24 },
    ]
};

const good = schema.safeParse(goodValue);

console.log("goodValue parsed", JSON.stringify(good, null, 2));
