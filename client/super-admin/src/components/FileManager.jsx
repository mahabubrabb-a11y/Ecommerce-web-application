import { useEffect, useState } from "react";
import Paginate from "../helper/Paginate";
import { useNavigate, useSearchParams } from "react-router-dom";
import fileStore from "../store/file.Store";
import Skeleton from "react-loading-skeleton";
import { baseURLFile } from "../helper/config";
import { DeleteAlertFile, ErrorToast, SuccessToast } from "../helper/Helper";
const FileManager = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [file, setFile] = useState(null);
  const {
    fileUploadRequest,
    fileUploadLoading,
    allFile,
    allFileRequest,
    totalFile,
    fileRemoveRequest,
  } = fileStore();

  const per_page = 12;
  const page_no = searchParams.get("page_no") || 1;

  useEffect(() => {
    (async () => {
      await allFileRequest(per_page, page_no);
    })();
  }, [allFileRequest, page_no]);

  //! pagination function
  const handelPageClick = async (event) => {
    let page_no = event.selected;
    await allFileRequest(per_page, page_no + 1);

    navigate(`/file-manager?page_no=${page_no + 1}`);
  };

  const handleUpload = async () => {
    if (!file) {
      ErrorToast("Please select a file first!");
      return;
    }
    await fileUploadRequest(file);
    await allFileRequest(per_page, page_no);
  };

  let deleteFile = async (_id, filename) => {
    let res = await DeleteAlertFile(fileRemoveRequest, _id, filename);
    if (res) {
      await allFileRequest(per_page, page_no);
    }
  };

  return (
    <>
      {/* Cover Photo Start */}
      <div className='cover-photo  overflow-hidden'>
        <div className='avatar-upload p-5'>
          <h2>Supper Admin</h2>
          <h5>File Manager</h5>
        </div>
      </div>
      {/* Cover Photo End */}
      <div className='dashboard-body__content profile-content-wrapper z-index-1 position-relative mt--150'>
        {/* Profile Content Start */}
        <div className='profile'>
          <div className='row gy-4'>
            <div className='col-12'>
              <div className='profile-info'>
                <div className='container my-5 p-4 border rounded shadow-sm bg-white'>
                  <h4 className='mb-3'>Upload Files</h4>
                  {/* Upload Input */}
                  <div className='mb-3'>
                    <input
                      type='file'
                      className='form-control'
                      multiple
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>

                  <div>
                    <button
                      onClick={handleUpload}
                      disabled={fileUploadLoading}
                      className='btn btn-danger '
                    >
                      {fileUploadLoading ? "Uploading..." : "Upload File"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12'>
              <div className='dashboard-card'>
                <div className=' p-5'>
                  <h4 className='mb-3'>Image Gallery</h4>
                  {allFile?.length === 0 && (
                    <p className='text-muted text-center'>
                      No images available.
                    </p>
                  )}
                  {allFile === null ? (
                    <>
                      {[...Array(6)].map(() => (
                        <div className='col-2 mb-5'>
                          <div className='Skeleton'>
                            <Skeleton count={8} />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className='row g-3'>
                        {allFile?.map((item, index) => (
                          <div
                            key={index}
                            className='col-2 col-xl-3 col-md-4 mb-5'
                          >
                            <div className='card img_g shadow-sm position-relative'>
                              {/* Delete button */}
                              <button
                                onClick={() =>
                                  deleteFile(item?._id, item?.filename)
                                }
                                className='btn  btn-danger position-absolute top-0 end-0 m-1 rounded-circle'
                              >
                                &times;
                              </button>

                              {/* Image */}
                              <img
                                src={`${baseURLFile}/${item?.filename}`}
                                className='card-img-top'
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />

                              {/* Card body */}
                              <div className='card-body p-2 text-center'>
                                <p
                                  className='small text-truncate mb-0 text-primary'
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      item.filename
                                    );
                                    SuccessToast("Copied: " + item.filename);
                                  }}
                                  title='Click to copy'
                                >
                                  Image1.jpg
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <nav aria-label='Page navigation example'>
                    {allFile?.length > 1 && (
                      <Paginate
                        handelPageClick={handelPageClick}
                        page_no={page_no}
                        per_page={per_page}
                        totalCount={totalFile}
                      />
                    )}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Profile Content End */}
      </div>
    </>
  );
};

export default FileManager;
