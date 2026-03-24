'use server';

export async function submitContactForm(formData: FormData) {
  // Placeholder — in production this would send an email
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    checkIn: formData.get('checkIn'),
    checkOut: formData.get('checkOut'),
    villa: formData.get('villa'),
    guests: formData.get('guests'),
    message: formData.get('message'),
    howFound: formData.get('howFound'),
  };

  console.log('Contact form submission:', data);

  return { success: true };
}
