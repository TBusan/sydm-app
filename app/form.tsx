import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface MediaItem {
  uri: string;
  type: 'image' | 'video';
}

export default function FormScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    media: [] as MediaItem[]
  });

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  const addMedia = (newMedia: MediaItem[]) => {
    handleChange('media', [...formData.media, ...newMedia]);
  };

  const removeMedia = (index: number) => {
    const updatedMedia = [...formData.media];
    updatedMedia.splice(index, 1);
    handleChange('media', updatedMedia);
  };

  const pickImage = async (useCamera = false) => {
    // Request permissions first
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to take photos!');
        return;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Media library permission is required to select images!');
        return;
      }
    }

    // Launch camera or image picker
    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
        allowsMultipleSelection: true,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newMedia = result.assets.map(asset => ({
        uri: asset.uri,
        type: 'image' as const
      }));
      addMedia(newMedia);
    }
  };

  const recordVideo = async (useCamera = true) => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to record videos!');
      return;
    }

    // Launch camera or video library
    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: true,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newMedia = result.assets.map(asset => ({
        uri: asset.uri,
        type: 'video' as const
      }));
      addMedia(newMedia);
    }
  };

  const renderMediaItem = ({ item, index }: { item: MediaItem, index: number }) => (
    <View style={styles.mediaItem}>
      {item.type === 'image' ? (
        <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
      ) : (
        <Video
          source={{ uri: item.uri }}
          style={styles.mediaPreview}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
        />
      )}
      <TouchableOpacity onPress={() => removeMedia(index)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.message}
          onChangeText={(text) => handleChange("message", text)}
          placeholder="Enter your message"
          multiline={true}
          numberOfLines={4}
        />

        <Text style={styles.label}>Upload Media</Text>
        <View style={styles.uploadContainer}>
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(false)}>
            <Text style={styles.uploadButtonText}>Choose Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(true)}>
            <Text style={styles.uploadButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.uploadContainer}>
          <TouchableOpacity style={[styles.uploadButton, styles.videoButton]} onPress={() => recordVideo(false)}>
            <Text style={styles.uploadButtonText}>Choose Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.uploadButton, styles.videoButton]} onPress={() => recordVideo(true)}>
            <Text style={styles.uploadButtonText}>Record Video</Text>
          </TouchableOpacity>
        </View>

        {formData.media.length > 0 && (
          <View style={styles.mediaContainer}>
            <Text style={styles.mediaCount}>{formData.media.length} items selected</Text>
            {formData.media.map((item, index) => renderMediaItem({ item, index }))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flex: 0.48,
  },
  videoButton: {
    backgroundColor: '#9C27B0',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  mediaContainer: {
    marginTop: 15,
  },
  mediaCount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  mediaItem: {
    marginBottom: 15,
    alignItems: 'center',
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '30%',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
}) 