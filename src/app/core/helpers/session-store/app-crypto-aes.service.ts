import { Injectable } from '@angular/core';
import CryptoES from 'crypto-es';
import { DeviceDetectorService } from '../device-detector/device-detector.service';

@Injectable({
  providedIn: 'root'})
export class AppCryptoAESService {

  key: string;

  constructor(
    private deviceService: DeviceDetectorService
  ) {
    this.key = CryptoES.MD5(JSON.stringify(this.deviceService.getDeviceInfo())).toString();
  }

   // The set method is use for encrypt the value.
  set(value: any) {
    if (value) {
      const encrypted = CryptoES.AES.encrypt(CryptoES.enc.Utf8.parse(value.toString()), this.key);
      return encrypted.toString();
    }
    return null;
  }

  setWithKey(keys: string, value: any) {
    const key = CryptoES.enc.Utf8.parse(keys);
    const iv = CryptoES.enc.Utf8.parse(keys);

    const encrypted = CryptoES.AES.encrypt(CryptoES.enc.Utf8.parse(value.toString()), key,
      {
        // keySize: 128 / 8,
        iv,
        mode: CryptoES.mode.CBC,
        padding: CryptoES.pad.Pkcs7
      });

    return encrypted.toString();
  }

  // The get method is use for decrypt the value.
  get(value: any) {
    try {
      if (value) {
        const decrypted = CryptoES.AES.decrypt(value, this.key);
        return decrypted.toString(CryptoES.enc.Utf8);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  getWithKey(keys:any, value: any) {
    const key = CryptoES.enc.Utf8.parse(keys);
    const iv = CryptoES.enc.Utf8.parse(keys);
    const decrypted = CryptoES.AES.decrypt(value, key, {
      // keySize: 128 / 8,
      iv,
      mode: CryptoES.mode.CBC,
      padding: CryptoES.pad.Pkcs7
    });

    return decrypted.toString(CryptoES.enc.Utf8);
  }
}
