package com.pgm.plataformapgm.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // Inyectamos las propiedades desde application.properties
    public CloudinaryService(
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public String subirImagen(MultipartFile archivo) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(archivo.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("secure_url").toString(); // URL pública segura
    }

    public void eliminarImagen(String url) throws IOException {
        // Extraer public_id de la url. La url tiene un formato como:
        // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{ext}
        // Debes parsear y extraer {public_id} para pasar a Cloudinary

        String publicId = extraerPublicIdDesdeUrl(url);

        if (publicId != null && !publicId.isEmpty()) {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        }
    }

    private String extraerPublicIdDesdeUrl(String url) {
        // Por ejemplo, si url = https://res.cloudinary.com/root/image/upload/v1234567890/perfil_12345.jpg
        // quieres extraer "perfil_12345" (sin extensión)
        try {
            int start = url.lastIndexOf('/') + 1;
            int end = url.lastIndexOf('.');
            if (start > 0 && end > start) {
                return url.substring(start, end);
            }
        } catch (Exception e) {
            // Manejar error
        }
        return null;
    }

}
