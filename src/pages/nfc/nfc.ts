import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { NFC, Ndef } from '@ionic-native/nfc';
import { TagUtil, Tag } from '../../classes/tags';

/**
 * Generated class for the NfcPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-nfc',
  templateUrl: 'nfc.html',
})
export class NfcPage {

  public buttonReadText: string;
  public buttonWriteText: string;
  public loading: boolean;
  private eventId: number;
  public eventTitle: string;
  public dataRead: any;
  public dataToWrite: any;
  public showForm: boolean;
  public showData: boolean;
  public tag: Tag;
  public allData: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nfc: NFC,
    private ndef: Ndef,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.eventId = this.navParams.get('eventId');
    this.eventTitle = this.navParams.get('eventTitle');

    this.buttonReadText = "Read Data";
    this.buttonWriteText = "Write Data";
    this.loading = false;
    this.showForm = false;
    this.showData = false;
    this.dataToWrite = {
      name: "",
      lastname: "",
      age: 0
    }
    this.tag = new Tag();
    this.allData = [];
  }

  readNfc() {
    console.log(`let's read from NFC card`);
    let newReadModal = this.alertCtrl.create({
      title: 'Read NFC',
      message: 'Make sure to put the card near to the phone',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('cancel clicked');
          }
        }, {
          text: 'OK',
          handler: data => {
            console.log('here the logic');
            //this.nfc.addTagDiscoveredListener((tagEvent) => this.tagListenerSuccess(tagEvent), (err) => this.readFail(err));
            this.nfc.addNdefListener()
              .subscribe(data => {
                console.log('data read');
                this.tag = TagUtil.readTagFromJson(data);
                this.dataRead = this.tag;
                console.log(this.dataRead);
                console.log('---')
                const array = this.dataRead.records;
                for (let record of array) {
                  record.payload.splice(0, 3);
                  this.allData.push(this.nfc.bytesToString(record.payload))
                }
                console.log(this.allData);
                this.showData = true;
              });
          }
        }
      ]
    });
    newReadModal.present(newReadModal);
  }

  showNfc() {
    this.showForm = true;
  }

  writeNfc() {
    console.log(`let's write to NFC card`);
    console.log(this.dataToWrite);
    // let message = this.ndef.textRecord('Hello world');
    let message = [this.ndef.textRecord(this.dataToWrite.name),
    this.ndef.textRecord(this.dataToWrite.lastname),
    this.ndef.textRecord(this.dataToWrite.age)];
    console.log('----');
    console.log(message)
    console.log('----');
    this.nfc.write(message)
      .then(data => {
        console.log(data);
        let toast = this.toastCtrl.create({
          message: `Write Success`,
          duration: 3000,
          position: 'bottom'
        });

        toast.present(toast);
      })
      .catch(err => {
        console.log('error...')
        console.log(err);
        let toast = this.toastCtrl.create({
          message: `Error ${err}`,
          duration: 3000,
          position: 'bottom'
        });

        toast.present(toast);
      });
  }

}

interface DataNfc {
  name: string,
  lastname: string,
  age: number
}
