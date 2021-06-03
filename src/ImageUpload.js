import { Button } from "@material-ui/core";
import { useState } from "react";
import { storage ,db} from "./firebase";
import "./ImageUpload.css"

import firebase from 'firebase';
function ImageUpload({username}){
    const [progress,setProgress] = useState(0);
    const [caption,setCaption] = useState("");
    const [image, setImage] = useState("");

    const handleChange = (e) => {
        // * resmi yakalama işlemleri
        let image = e.target.files[0];
        if(image){
            setImage(image);
        }
    }

    const handleUpload = (e) => {
        // * resmi yükleme  butona tklayınca
        const uploadTasx = storage.ref(`images/${image.name}`).put(image);
        // * eventi dinlemeye yarar
        uploadTasx.on("state_changed",(snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        setProgress(progress);
    },error => {
        console.log(error)
    },
     () => {
         storage.ref("images")
         // * storage.ref yaparak çocuğu olarak ekle diyoruz image.name i
            .child(image.name)
            // *  indirilebilir linki olarak ver diyoruz
            .getDownloadURL()
            .then(url => {
                // * GELEN URL'i veritabanına ekleme
                db.collection("posts").add({
                    // resmin yüklenme zamanın alma
                    timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: url,
                    username:username,
                });
                setProgress(0);
                setCaption("");
                setImage("");
            })
     }
    
    );
         
    }

    return (
        <div className="image-upload">
            <progress
            className="imageUpload-progress"
            value={progress}
            max={"100"}
            />
            <input className="inputm" type="text" value={caption} onChange={(e) => setCaption(e.target.value)} 
            placeholder={"İçeriği girin: "} />

            <input type="file" onChange={handleChange} />
            <Button className={"imageUpload-button"} onClick={handleUpload}>Yükle</Button>
        </div>
    )
}

export default ImageUpload;