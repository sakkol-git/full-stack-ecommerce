import { useState } from "react";
import type { CreateProductPayload, Product } from "../types/product.types";

interface ProductFormProps {
  onSubmit: (payload: CreateProductPayload) => Promise<Product>;
  isSubmitting: boolean;
}

export function ProductForm({
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    const price = Number(formData.price);

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (!Number.isFinite(price) || price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = "Image must be a valid URL";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const payload: CreateProductPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      image: formData.image.trim(),
    };

    try {
        await onSubmit(payload);

    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
    });

    setErrors({});
    } catch (error) {
        setErrors((prev) => ({
            ...prev,
            submit: error instanceof Error? error.message : "Failed to create product",
        }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />

        {errors.name && <p>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {errors.description && (
          <p>{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="price">Price</label>

        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
        />

        {errors.price && <p>{errors.price}</p>}
      </div>

      <div>
        <label htmlFor="image">Image URL</label>

        <input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
        />

        {errors.image && <p>{errors.image}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Create Product"}
      </button>
    </form>
  );
}