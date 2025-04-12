import { supabase } from '../lib/supabase';

export const uploadCourseImage = async (file: File) => {
  try {
    // Check file size (5MB limit)
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 5) {
      throw new Error('File size should be less than 5MB');
    }

    // Check if the bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'course-images');

    if (!bucketExists) {
      const { error: createBucketError } = await supabase.storage.createBucket('course-images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (createBucketError) throw createBucketError;
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('course-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data } = supabase.storage
      .from('course-images')
      .getPublicUrl(fileName);

    return { url: data.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading course image:', error);
    return { 
      url: null, 
      error: error instanceof Error ? error.message : 'Error uploading image' 
    };
  }
};