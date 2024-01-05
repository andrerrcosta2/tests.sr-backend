import cripto from "crypto";

export const random = () => {
    return cripto.randomBytes(128)
        .toString("base64");
}