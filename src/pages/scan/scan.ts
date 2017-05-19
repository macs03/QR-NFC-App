import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BarcodeScanner } from "@ionic-native/barcode-scanner";

/**
 * Generated class for the ScanPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {

  public buttonText: string;
  public loading: boolean;
  private eventId: number;
  public eventTitle: string;
  public dataScaned: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner) {
  }

  ionViewDidLoad() {
    this.eventId = this.navParams.get('eventId');
    this.eventTitle = this.navParams.get('eventTitle');

    this.buttonText = "Scan";
    this.loading = false;
  }

  scanQR() {
    this.buttonText = "Loading..";
    this.loading = true;

    this.barcodeScanner.scan().then((barcodeData) => {
      if (barcodeData.cancelled) {
        console.log('the user cancel the reading..');
        this.buttonText = "Scan";
        this.loading = false;
        return false;
      }
      console.log('data scaned');
      console.log(barcodeData);
      this.dataScaned = barcodeData.text;
      this.buttonText = "Scan";
      this.loading = false;
    }, (err) => {
      console.log(err);
    });

  }

}
