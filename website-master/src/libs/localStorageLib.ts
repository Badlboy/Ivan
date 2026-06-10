export class LocalStorageLib { 
    static checkLS () { 
        return 'localStorage' in globalThis;
    }

    static setItem (key:string,value:any) {
        if(!LocalStorageLib.checkLS()) return null;
        return localStorage.setItem(key,value);
    }
    static getItem (key:string) { 
        if(!LocalStorageLib.checkLS()) return null;
        return localStorage.getItem(key);
    }
    static clearItem (key:string) { 
        if(!LocalStorageLib.checkLS()) return null;
        localStorage.removeItem(key);
    }
}