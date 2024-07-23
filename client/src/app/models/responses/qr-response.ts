export class QrResponse {
    type: string;
    qrCode: string;
    

    constructor(
        type: string,
        qrCode: string
    ) {
        this.type = type;
        this.qrCode = qrCode;
    }
}