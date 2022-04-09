import { gql, useMutation } from "@apollo/client";

const SINGLE_UPLOAD = gql`
  mutation($files: [Upload]) {
    singleUpload(files: $files) {
      filename
      mimetype
      encoding
      url
    }
  }
`;

export default function UploadFile() {
  const [mutate] = useMutation(SINGLE_UPLOAD);

  function onChange({
    target: {
      validity,
      files,
    },
  }) {
    // let reader = new FileReader()
    // reader.onload = function (event) {
    //     console.log(event.target.result);
    //     console.log(typeof event.target.result);
    //     if (validity.valid) mutate({ variables: { file: event.target.result } });
    // };
    // reader.readAsDataURL(file);
    console.log(files)
    if (validity.valid) mutate({
      variables: { files },
      context: {
        fetchOptions: {
          useUpload: true,
          onProgress: (ev) => {
            console.log(ev.loaded / ev.total);
          },
          // onAbortPossible: (abortHandler) => {
          //   abort = abortHandler;
          // }
        }
      }
    });

  }

  return <input type="file" multiple onChange={onChange} />;
}