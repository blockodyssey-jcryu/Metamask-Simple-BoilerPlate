import MobileDetect from "mobile-detect";

import { OS_TYPE } from "../../constants/common";

class MobileDetector {
    static #mobileDetect;

    static getOS() {
        return this.#mobileDetect.os();
    }

    static getBrowserVersion() {
        const browserName = this.getBrowserName();
        return this.#mobileDetect.version(browserName);
    }

    static getOSVersion() {
        const os = this.getOS();

        if (os === OS_TYPE.ANDROID) {
            return this.#mobileDetect.version("Android");
        }

        return this.#mobileDetect.version(os);
    }

    static getBrowserName() {
        return this.#mobileDetect.userAgent();
    }

    static getMobileType() {
        return this.#mobileDetect.mobile();
    }

    static isMobile() {
        const mobileType = this.getMobileType();
        return Boolean(mobileType);
    }

    static initialize() {
        this.#mobileDetect = new MobileDetect(navigator.userAgent);
    }
}

export default MobileDetector;
