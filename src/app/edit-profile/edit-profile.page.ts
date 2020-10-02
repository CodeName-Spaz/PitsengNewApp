import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, PopoverController, NavParams, NavController, Platform, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  db = firebase.firestore().collection('UserProfile')


  // name
  // email


  storage = firebase.storage().ref();

  profile = {
    image: '',
    name: '',
    number: '',
    address: '',
    email: '',
    uid: ''
  }

  errtext = '';
  uploadprogress = 0;
  isuploading = false;
  isuploaded = false;
  user = {
    uid: '',
    email: ''
  }
  loader: boolean = true;
  isprofile: boolean = false;
  myArr = [];
  constructor(public alertCtrl: AlertController, private router: Router, public route: ActivatedRoute, public navCtrl: NavController,
    public plt : Platform, public actionSheetController : ActionSheetController, public camera : Camera) {
    // this.route.queryParams.subscribe(params => {
    //   this.profile.name = params["name"];
    //   this.profile.email = params["email"];
    //   this.profile.name = params["name"];
    //   this.profile.email = params["email"];
    //   this.profile.name = params["name"];
    //   this.profile.email = params["email"];
    // })
  }

  ngOnInit() {
    this.getProfile();
   
  }

  createAccount() {
    this.db.doc(firebase.auth().currentUser.uid).update({ name: this.profile.name,
       number: this.profile.number,
        email: this.profile.email, 
        address: this.profile.address }).then(res => {
      this.router.navigateByUrl('/profile');
    }).catch(error => {
      console.log('Error');
    });
  }

  getProfile() {
    this.db.doc(firebase.auth().currentUser.uid).onSnapshot(snapshot => {
      // if (snapshot.empty) {
      //   this.isprofile = false;
      //   console.log("No is not Profile");

      // } else {
      this.isprofile = false;
      // snapshot.forEach(doc => {
      this.profile.address = snapshot.data().address;
      this.profile.image = snapshot.data().image
      this.profile.name = snapshot.data().name
      this.profile.number = snapshot.data().number
      this.profile.email = snapshot.data().email
      // this.profile.streetAddress = doc.data().streetAddress;
      // this.profile.city = doc.data().city;
      // this.profile.code = doc.data().code
      // console.log("Yes is Profile");


      // })
      // }
    })
    ////
    //////
  }
  async selectImage() {
    if (this.plt.is('cordova')) {
      const actionSheet = await this.actionSheetController.create({
        header: "Select image",
        buttons: [{
          icon: 'images',
          text: 'Gallery',

          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
          }
        },
        {
          icon: 'camera',
          text: 'Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA)
          }
        },
        {
          icon: 'close',
          text: 'Cancel',
          role: 'cancel'
        }
        ]
      });

      await actionSheet.present();
    } else {
      
    }
  }


  // featuredPhotoSelected(event: any) {
  //   const i = event.target.files[0];
  //   const upload = this.storage.child('HomeOwner-Profile/'+i.name).put(i);
  //   upload.on('state_changed', snapshot => {
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     console.log('upload is: ', progress, '% done.');
  //   }, err => {
  //   }, () => {
  //     upload.snapshot.ref.getDownloadURL().then(dwnURL => {
  //       // console.log('File avail at: ', dwnURL);
  //       this.profilePic = dwnURL;
  //       this.dbProfile.doc(firebase.auth().currentUser.uid).update({profilePic: this.profilePic})
  //     });
  //   });
  //  // console.log("My pic is ", this.profilePic);
  // }
  async takePicture(sourcetype: PictureSourceType) {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      quality: 90,
      targetHeight: 600,
      targetWidth: 600,
      sourceType: sourcetype,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    await this.camera.getPicture(options).then(res => {
      let base64Image = 'data:image/jpeg;base64,' + res;
      //this.profileImage = base64Image;
      let file = 'HomeOwner-Profile/' + firebase.auth().currentUser.uid + '.jpg';
      const UserImage = this.storage.child(file);
      const upload = UserImage.putString(base64Image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //  this.uploadprogress = progress;
        console.log('Uploading image..', progress);
        //this.loaderAnimate = true;
        //  this.loaderMessages = 'Uploading Image...';
        // if (progress == 100) {
        //   //this.isuploading = false;
        // }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.profile.image = downUrl;
          // console.log('Image downUrl.............', this.HomeOwnerProfile.image);
          /*     setTimeout(() => {
               this.loaderAnimate = false;
             }, 1000); */
          //  this.isuploaded = true;
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
    // this.imageSelected = true;
    // })
  }
 
  changeListener(event): void {
    const i = event.target.files[0];
    console.log(i);
    const upload = this.storage.child(i.name).put(i);
    upload.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('upload is: ', progress, '% done.');
    }, err => {
    }, () => {
      upload.snapshot.ref.getDownloadURL().then(dwnURL => {
        this.db.doc(firebase.auth().currentUser.uid).set({image:dwnURL
      }, { merge: true })
        this.profile.image = dwnURL;
        this.db.doc(firebase.auth().currentUser.uid).update({image : this.profile.image})
      });
    });
  }

  popBack() {
    this.navCtrl.pop();
  }
}
