"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import BrandSelect from "./BrandSelect";
import CategorySelect from "./CategorySelect";
import axiosInstance from "@/context/axiosContext";

// 🚀 form الأساسي (فاضي)
const initialForm = {
  invoiceId: "",
  invoiceDate: "",
  name: "",
  description: "",
  price: 0,
  stock: 0,
  brand: "",
  category: "",
  images: [],
  attributes: [],
  discountRate: 0,
    section: "",   // ✅ جديد

  isFeatured: false,

};

const ProductForm = ({ onSuccess, mode = "add", initialData }) => {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);

  // 🚀 تهيئة البيانات عند التعديل
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialForm,
        ...initialData,
        brand: initialData.brand?._id || initialData.brand || "",
        category: initialData.category?._id || initialData.category || "",
        attributes: initialData.attributes || [],
          section: initialData.section?._id || initialData.section || "", // ✅ جديد

        images: initialData.images || [],
        isFeatured: initialData.isFeatured || false,
      });
    }
  }, [initialData]);

  // حساب الإجمالي
  useEffect(() => {
    setTotalPrice(form.price * form.stock);
  }, [form.price, form.stock]);

  // حساب بعد الخصم
  useEffect(() => {
    const discountedPrice =
      totalPrice - totalPrice * (form.discountRate / 100);
    setTotalAfterDiscount(discountedPrice);
  }, [totalPrice, form.discountRate]);

  // تغيير الصور
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  // إرسال الفورم
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // تحقق من الماركة والفئة
    if (!form.brand || !form.category) {
      toast.error("من فضلك اختر ماركة وفئة للمنتج");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("invoiceId", form.invoiceId);
    formData.append("invoiceDate", form.invoiceDate);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("discountRate", form.discountRate || 0);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("brand", form.brand);
    formData.append("category", form.category);
    formData.append("section", form.section); // ✅ جديد
    formData.append("isFeatured", form.isFeatured ? "true" : "false");
    
    formData.append("attributes", JSON.stringify(form.attributes));

    // رفع الصور
    form.images.forEach((img) => {
      if (img instanceof File) {
        formData.append("images", img);
      } else {
        formData.append("existingImages", img); // 👈 نميز بين الصور القديمة والجديدة
      }
    });

    try {
      if (mode === "edit" && form._id) {
        formData.append("id", form._id);
        await axiosInstance.put(`/admin/products/${form._id}`, formData);
        toast.success("تم تعديل المنتج بنجاح ✅");
      } else {
        await axiosInstance.post("/admin/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("تمت إضافة المنتج بنجاح ✅");
      }

      if (onSuccess) onSuccess(); // <-- Ensure this is called after success
      // Optionally reset form:
      setForm(initialForm);
      // Optionally close modal/drawer if you use one
      // router.push("/ui/admin/products"); // Uncomment if you want to navigate
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error("فشل حفظ المنتج ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* الفاتورة */}
      <input
        type="text"
        placeholder="رقم الفاتورة"
        value={form.invoiceId}
        onChange={(e) => setForm({ ...form, invoiceId: e.target.value })}
        className="border rounded px-4 py-2 w-full"
      />
      <input
        type="date"
        placeholder="تاريخ الفاتورة"
        value={form.invoiceDate}
        onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
        className="border rounded px-4 py-2 w-full"
      />

      {/* الاسم والوصف */}
      <input
        type="text"
        placeholder="اسم المنتج"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="border rounded px-4 py-2 w-full"
      />
      <textarea
        placeholder="وصف المنتج"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
        className="border rounded px-4 py-2 w-full"
      />

      {/* السعر */}
      <label className="block text-sm font-medium text-gray-700">السعر</label>
      <input
        type="number"
        placeholder="السعر"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        required
        className="border rounded px-4 py-2 w-full"
      />

      {/* الكمية */}
      <label className="block text-sm font-medium text-gray-700">الكمية</label>
      <input
        type="number"
        placeholder="الكمية"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        required
        className="border rounded px-4 py-2 w-full"
      />

      {/* الإجمالي */}
      <p className="text-green-600 font-bold">
        إجمالي السعر: {totalPrice} جنيه
      </p>

      {/* الخصم */}
      <label className="block text-sm font-medium text-gray-700">
        نسبة الخصم % <span className="text-gray-500">(اختياري)</span>
      </label>
      <input
        type="number"
        placeholder="نسبة الخصم"
        value={form.discountRate}
        onChange={(e) =>
          setForm({ ...form, discountRate: Number(e.target.value) })
        }
        className="border rounded px-4 py-2 w-full"
      />

      {/* السعر بعد الخصم */}
      <label className="block text-sm font-medium text-gray-700">
        السعر بعد الخصم
      </label>
      <input
        type="number"
        readOnly
        value={totalAfterDiscount}
        className="border rounded px-4 py-2 w-full text-green-600 font-bold"
      />

      {/* المنتج مميز */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isFeatured || false}
          onChange={(e) =>
            setForm({ ...form, isFeatured: e.target.checked })
          }
          className="h-4 w-4"
        />
        <label className="text-gray-700">المنتج مميز؟</label>
      </div>

      {/* الخصائص */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          الخصائص (Attributes)
        </label>
        {form.attributes.map((attr, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              placeholder="اسم الخاصية"
              value={attr.key}
              onChange={(e) => {
                const newAttrs = [...form.attributes];
                newAttrs[idx].key = e.target.value;
                setForm({ ...form, attributes: newAttrs });
              }}
              className="border rounded px-2 py-1 w-1/3"
            />
            <input
              type="text"
              placeholder="القيم (مفصولة بفواصل)"
              value={attr.value.join(",")}
              onChange={(e) => {
                const newAttrs = [...form.attributes];
                newAttrs[idx].value = e.target.value.split(",");
                setForm({ ...form, attributes: newAttrs });
              }}
              className="border rounded px-2 py-1 w-2/3"
            />
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  attributes: form.attributes.filter((_, i) => i !== idx),
                })
              }
              className="bg-red-500 text-white px-2 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              attributes: [...form.attributes, { key: "", value: [] }],
            })
          }
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + إضافة خاصية
        </button>
      </div>

      {/* القوائم المنسدلة */}
      <BrandSelect
        value={form.brand}
        onChange={(val) => setForm({ ...form, brand: val })}
      />
   <CategorySelect
  value={form.category}
  onChange={(catId, sectionId) =>
    setForm({ ...form, category: catId, section: sectionId })
  }
/>

      {/* الصور */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="border rounded px-4 py-2 w-full"
      />

      {/* معرض الصور */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {Array.isArray(form.images) &&
          form.images.map((img, idx) => {
            const isFile = img instanceof File;
            const previewUrl = isFile ? URL.createObjectURL(img) : img;

            return (
              <div key={idx} className="relative">
                <img
                  src={previewUrl}
                  alt={`صورة ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      images: form.images.filter((_, i) => i !== idx),
                    })
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            );
          })}
      </div>

      {/* زر الإرسال */}
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        {loading
          ? mode === "edit"
            ? "جاري التعديل..."
            : "جاري الإضافة..."
          : mode === "edit"
          ? "تعديل المنتج"
          : "إضافة المنتج"}
      </button>
    </form>
  );
};

export default ProductForm;
