import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
  });

  const [imageUploadErrors, setImageUploadErrors] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(files);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadErrors(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
      
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });

          setUploading(false);
          setImageUploadErrors(false);
        })

        .catch((error) => {
          setImageUploadErrors("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadErrors("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  console.log(formData)
  
  const storeImage = async (file) => {
    console.log("Uploading file:", file);
    return new Promise(async (resolve, reject) => {
      const formData1 = new FormData();
      formData1.append("file", file);
      formData1.append("upload_preset", "estateWebsite");
      formData1.append("cloud_name", "dddvdibng");
  
      try {
        console.log("FormData contents:", formData1);
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dddvdibng/image/upload",
          formData1,
          {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Uploading: ${percentCompleted}%`);
            }
          }
        );
        resolve(response.data.secure_url);
      } catch (error) {
        console.error("Image upload failed:", error);
        reject(error);
      }
    });
  };
  


  const handleRemoveImage = (index) => {
    setFormData({
      formData,
      imageUrls: formData.imageUrls.filter((_, i) => {
        return console.log(i), i !== index;
      }),
    });
    toast.success("Image removed Succesfully")
  };

  const handleChange = (e) => {
    if (e.target.id == "sale" || e.target.id == "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id == "furnished" ||
      e.target.id == "offer" ||
      e.target.id == "parking"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type == "number" ||
      e.target.type == "text" ||
      e.target.type == "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        toast.info("You must upload one image")
        console.log("tost", formData)
        return setError("You must upload one image");
      }

      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);

      let res = await fetch("https://mern-estate-project-eta.vercel.app/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success == false) {
        setError(data.message);
      }



      navigate(`/listing/${data._id}`);


    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };





  return (
    <main className="p-3 max-w-4xl mx-auto my-60px">
      <div>
        <h1 className="text-3xl font-semibold text-center">Create a Listing</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex flex-col gap-4 flex-1 my-5">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg"
              id="name"
              maxLength="100"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="textarea"
              placeholder="Description"
              className="border p-3 rounded-lg"
              id="description"
              maxLength="100000000"
              minLength="100"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg"
              id="address"
              required
              maxLength="100000000"

              onChange={handleChange}
              value={formData.address}
            />

            <div className="flex gap-6 flex-wraP ">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span className="flex flex-row">
                  Sale <span className="text-red-700">*</span>
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span className="flex flex-row">
                  Rent <span className="text-red-700">*</span>
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span className="flex flex-row">
                  Parking spot<span className="text-red-700">*</span>
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span className="flex flex-row">
                  Furnished <span className="text-red-700">*</span>
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span className="flex flex-row">
                  Offer <span className="text-red-700">*</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <input
                  className="p-3 w-13 h-9 border-gray-300 rounded-lg"
                  type="number"
                  id="bedrooms"
                  min="20"
                  max="80"
                  required
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <span className="flex flex-row">
                  Beds <span className="text-red-700">*</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="p-3 w-13 h-9 border-gray-300 rounded-lg"
                  type="number"
                  id="bathrooms"
                  min="10"
                  max="40"
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <span className="flex flex-row">
                  Bathroom <span className="text-red-700">*</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="p-3 w-13 h-9 border-gray-300 rounded-lg"
                  type="number"
                  id="regularPrice"
                  min="1,00,000"
                  max="19,00,00,000"
                  required
                  onChange={handleChange}
                  value={formData.regulatPrice}
                />
                <div className="flex flex-col items-center">
                  <p className="flex flex-row">
                    Regular price <span className="text-red-700">*</span>
                  </p>
                  {formData.type === 'rent' && <span className="text-xs">(Rs / Month)</span>}
                </div>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    className="p-3 w-13 h-9 border-gray-300 rounded-lg"
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="1,99,000"
                    required
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p className="flex flex-row">
                      Discounted price <span className="text-red-700">*</span>
                    </p>
                    {formData.type === 'rent' && <span className="text-xs">(Rs / Month)</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-4 my-5">
            <p className="font-bold">
              Images<span className="text-red-700">*</span>:
              <span className="font-semibold text-gray-600 ml-2">
                {" "}
                The first image will be the cover(max 6)
              </span>
            </p>

            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              ></input>
              <button
                onClick={handleImageSubmit}
                disabled={uploading}
                type="button"
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Uploading" : "Upload"}
              </button>
            </div>

            <p className="text-red-600 font-semibold">
              {imageUploadErrors && imageUploadErrors}
            </p>

            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((urls, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between p-3 border items-center"
                  >
                    <img
                      src={urls}
                      key={index}
                      className="rounded-sm brightness-75 w-3/5 h-28 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveImage(index);
                      }}
                      className="text-red-500 font-semibold hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            <button

              disabled={loading || uploading}
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Loading..." : "Create Listing"}
            </button>

            {error && <p className="text-red-700 text-lg">{error}</p>}
          </div>
        </form>
      </div>
      <ToastContainer theme="dark" position="bottom-right" />
    </main>
  );
};

export default CreateListing;
