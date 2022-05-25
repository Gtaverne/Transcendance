import { useState } from 'react';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';

const STORAGE_PATH = process.env.REACT_APP_STORAGE_PATH || '';

type Props = {};

function StorageManager({}: Props) {
//   const [profilePic, setProfilePic] = useState<File>();
//   const [preview, setPreview] = useState();
//   const formData: any = new FormData();

//   const { user } = useSelector((state: RootStateOrAny) => state.auth);

//   const onUpload = () => {
//     console.log('Upload that picture in our CDN');
//     formData.append(`profileof${user.id}`, profilePic);

//     try {

//       console.log(STORAGE_PATH + '/upload/' + user.id);
//       axios.post(STORAGE_PATH + '/upload/' + user.id, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         params: { jwt: Cookies.get('jwt') },
//       });

//       console.log('We tried to get a pp');
//     } catch (error) {
//       console.log('The picture upload failed');
//     }
//   };

//   const onChange = (e: React.FormEvent) => {
//     const files = (e.target as HTMLInputElement).files;

//     console.log('We received this picture: ', files);
//     if (files && files.length > 0) {
//       setProfilePic(files[0]);
//     }
//   };

//   return (
//     <>
//       <img className="profilepage" src={user.avatar} />

//       <div>Upload your avatar</div>
//       <form
//         // method="post"
//         encType="multipart/form-data"
//         // action="uploadform/form"
//       >
//         <input
//           className=""
//           type="file"
//           name="fileToUpload"
//           id="fileToUpload"
//           onChange={onChange}
//         />
//         <input type="submit" value="Upload!" onSubmit={onUpload} />
//       </form>
//     </>
//   );
}

export default StorageManager;
