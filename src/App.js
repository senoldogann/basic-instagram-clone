import { Button, Input } from '@material-ui/core';
import './App.css';
import { React, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import Post from './Post';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 // * veritabanındaki posts'ları tutacak değişken
 const [posts, setPosts] = useState([]);
 // * Giriş yaparken kullanıcı var mı yok mu
 const [user,setUser] = useState(null);

 const signUp = (event) => {
  event.preventDefault();
  auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName:username
      })
       .then(() => window.location.reload())
     
    }).catch((error) => alert(error.message));
    setOpen(false);
};

const signIn = (event) => {
  event.preventDefault();
  // * Giriş işlemleri
  auth.signInWithEmailAndPassword(email,password)
  .then((authUser) => {
   setUser(authUser.user);
  })
 
  
  .catch(error => alert(error.message));
  setOpenSignIn(false);
 

};


  useEffect(() => {
    // * user her giriş çıkış yaptığında bu fonksiyon onu yakalar
    const unSubscribe = auth.onAuthStateChanged((authUser) => {
          if(authUser){
            // * Giriş yaptı
            setUser(authUser);
          }else{
            // * Çıkış yaptı
            setUser(null);
          }
    })
    // *  ve fonksiyonu geriye dönüyoruz
    return () => unSubscribe();
  },[user,username])

   
  // * Component render edildiğinde çalışacak fonksiyon
  useEffect(() => {
    // * posts umuza erişiyoruz
    db.collection("posts")
      // * veri tabanında her değişiklilik olduğunda onSnapshot'a yansır sürekli dökümanı izler
      .onSnapshot(snapshot => {
        // * gelen snapshot ile posts'ların içini dolduracağız
        setPosts(snapshot.docs.map(document => ({
          // * her bir document = post
          // * post id aldık
          id: document.id,
          // * post datayı aldık
          post: document.data(),
        })))
      })
  }, [])

  

  return (

    <div className="App">

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        { 
        <div style={modalStyle} className={classes.paper}> 
        <form className={"app-signUp"}>
         <center> 
          <img className="app-headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
          </center>
    
          <Input 
          placeholder={"Email"} 
          type={"email"} 
          value={email}
          onChange={(e) => setEmail(e.target.value) } />
          
          <Input 
          placeholder={"Şifre "} 
          type={"password"} 
          value={password}
          onChange={(e) => setPassword(e.target.value) } />

          <Button type={"submit"} onClick={signIn}>Giriş Yap</Button>
        </form>
        </div> 
        }
        
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        { 
        <div style={modalStyle} className={classes.paper}> 
        <form className={"app-signUp"}>
          <div className={"app-signUp-logo"}>
          <img className="app-headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
          </div>
          <Input 
          placeholder={"Kullanıcı adı"} 
          type={"text"} 
          value={username}
          onChange={(e) => setUsername(e.target.value) } />
          
          <Input 
          placeholder={"Email"} 
          type={"email"} 
          value={email}
          onChange={(e) => setEmail(e.target.value) } />
          
          <Input 
          placeholder={"Şifre "} 
          type={"password"} 
          value={password}
          onChange={(e) => setPassword(e.target.value) } />

          <Button type={"submit"} onClick={signUp}>KAYIT OL</Button>
        </form>
        </div> 
        }
        
      </Modal>


     
      <div className="app-header">
        <img className="app-headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
        {
          user ? (
            <Button onClick={() => auth.signOut()}>Çıkış Yap</Button>
          ) : (
            <div className="app-loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Giriş Yap</Button>
            <Button onClick={() => setOpen(true)}>Kayıt Ol</Button>
          </div>
          )
        }
        
      </div>
      <div className="app-posts">
        <div className="app-postsContent">
          {
            // * POSTLAR İÇİNDE GEZİP ONLARI MAP ETME
            posts.map(({ id, post }) => (
              <Post
                key={id}
                postId={id}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                user={user}
              />

            ))
          }
        </div>
      </div>
      {
        // * user varmı ve varsa displayName'i var mı diyoruz
        user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3 style={{textAlign:"center"}}>Lütfen önce Giriş Yapınız</h3>
        )

       
      }
    </div>

  );
}

export default App;
