import { Input } from '../ui/input';
import { uploadFiles, UploadPrp } from './utils';

export default function UploadFile(prp: UploadPrp) {
  return (
    <Input
      type="file"
      name="file"
      accept={prp.accept?.join(',')}
      onChange={async (e) => {
        if (e.target.files) {
          uploadFiles(prp, e.target.files);
        }
      }}
    />
  );
}
