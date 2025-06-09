import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export class DeviceInfoModel {
  isDesktop: boolean = false;
  isTablet: boolean = false;
  isMobile: boolean = false;
  isLargeDesktop: boolean = false;

  constructor() {}
}

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {

  module: any;

  private state = new DeviceInfoModel();
  public deviceSubj = new BehaviorSubject(this.state);
  platformSubs: any[] = [];

  private readonly mobile: string = '(max-width: 640px)';
  private readonly tablet: string = '(min-width: 641px) and (max-width: 1007px)';
  private readonly desktop: string = '(min-width: 1008px)';
  // private readonly largeDesktop = '(min-width : 1824px)';

  isBrowser = false;


  constructor(
    private platform: BreakpointObserver,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);


    if (this.isBrowser) {

      this.platformSubs.push(
        this.platform.observe([this.mobile, this.tablet, this.desktop]).subscribe((state : BreakpointState)  => {
          this.state.isMobile = false;
          this.state.isDesktop = false;
          this.state.isTablet = false;
          // this.state.isLargeDesktop = false;


          switch(true) {
            case state.breakpoints[this.mobile]:
              {this.state.isMobile = true; break;}
            case state.breakpoints[this.tablet]:
              {this.state.isTablet = true; break;}
            case state.breakpoints[this.desktop]:
              {this.state.isDesktop = true; break;}
            // case state.breakpoints[this.largeDesktop]:
            //   {this.state.isLargeDesktop = true; break;}
          }

          // if(state.breakpoints[this.mobile])
          // {
          //   // Website viewed on a small screen
          //   this.state.isMobile = true;
          // }

          // if(state.breakpoints[this.tablet])
          // {
          //   // Tablet computer
          //   this.state.isTablet = true;
          // }
          // if(state.breakpoints[this.desktop])
          // { this.state.isDesktop = true; }

          // if(state.breakpoints[this.largeDesktop])
          // { this.state.isLargeDesktop = true; }

          this.deviceSubj.next(this.state);
        })
      );

      const win: any = window;

      this.module = {
        options: [],
        header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, win['opera']],
        dataos: [
            { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
            { name: 'Windows', value: 'Win', version: 'NT' },
            { name: 'iPhone', value: 'iPhone', version: 'OS' },
            { name: 'iPad', value: 'iPad', version: 'OS' },
            { name: 'Kindle', value: 'Silk', version: 'Silk' },
            { name: 'Android', value: 'Android', version: 'Android' },
            { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
            { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
            { name: 'Macintosh', value: 'Mac', version: 'OS X' },
            { name: 'Linux', value: 'Linux', version: 'rv' },
            { name: 'Palm', value: 'Palm', version: 'PalmOS' }
        ],
        databrowser: [
            { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
            { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
            { name: 'Safari', value: 'Safari', version: 'Version' },
            { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
            { name: 'Opera', value: 'Opera', version: 'Opera' },
            { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
            { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
        ],
        // init () {

        //     return { os, browser };
        // },
      };
    }
  }

  getDeviceInfo(): any {
    if (this.isBrowser) {
      const agent = this.module.header.join(' ');
      const os = this.matchItem(agent, this.module.dataos);
      const browser = this.matchItem(agent, this.module.databrowser);
      return { os, browser };
    }

  }

  matchItem (stringToTest: string, data: any) {
    // eslint-disable-next-line one-var
    let i = 0, j = 0, regex, regexv, match, matches, version;

    for (i = 0; i < data.length; i += 1) {
        regex = new RegExp(data[i].value, 'i');
        match = regex.test(stringToTest);
        if (match) {
            regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
            matches = stringToTest.match(regexv);
            version = '';
            if (matches) { if (matches[1]) { matches = matches[1]; } }
            if (matches) {
                matches = typeof matches == 'string' ? matches.split(/[._]+/) : matches;
                for (j = 0; j < matches.length; j += 1) {
                    if (j === 0) {
                        version += matches[j] + '.';
                    } else {
                        version += matches[j];
                    }
                }
            } else {
                version = '0';
            }
            return {
                name: data[i].name,
                version: parseFloat(version)
            };
        }
    }
    return { name: 'unknown', version: 0 };
  }

  Unsubscribe() {
    if (this.deviceSubj)
    { this.deviceSubj.unsubscribe(); }
  }
}
