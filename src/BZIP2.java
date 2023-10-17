import org.apache.commons.compress.archivers.*;
import org.apache.commons.compress.archivers.ar.ArArchiveInputStream;
import org.apache.commons.compress.compressors.bzip2.BZip2CompressorInputStream;
import org.apache.commons.compress.utils.IOUtils;
import java.io.*;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import java.util.ArrayList;
import org.apache.commons.exec.ExecuteException;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.MalformedJsonException;

public class BZIP2 {
    public static void main(String[] args) { 
        try {          
       
          ArrayList<String> extractedBZip2FileList = new ArrayList<>();
         
            File extractDir;
            Gson gson = new Gson();
          BZip2Archive[] bzip2Archive = gson.fromJson(args[0],  BZip2Archive[].class);
            for ( BZip2Archive bZip2ArchiveFile : bzip2Archive ){
                try (
                 BufferedInputStream bis = new BufferedInputStream(new FileInputStream((new File("uploads"+File.separator+bZip2ArchiveFile.path)).getAbsolutePath()));
                 ArArchiveInputStream ais = new ArArchiveInputStream(new BZip2CompressorInputStream(bis));
               ) {
                extractDir = new File(("intermediary" +File.separator+bZip2ArchiveFile.originalName.split("\\.")[0]+'_'+bZip2ArchiveFile.path.split("\\.")[0]));
                String extractAbs= extractDir.getAbsolutePath();
                extractDir = new File(extractAbs);
                extractedBZip2FileList.add(extractAbs);
                extractDir.mkdirs();
                ArchiveEntry entry;
                while ((entry = ais.getNextEntry()) != null) {
                    if (!ais.canReadEntryData(entry)) {
                        continue;
                    }

                    File file = new File(extractDir, entry.getName());

                    if (entry.isDirectory()) {
                        file.mkdirs();
                    } else {
                        try (FileOutputStream fos = new FileOutputStream(file)) {
                            IOUtils.copy(ais, fos);
                        }
                    }
                }
            }
        }
    
        System.out.println(gson.toJson(extractedBZip2FileList));
        } catch (ExecuteException e) {
            System.out.println(e);  
        }
        catch (JsonSyntaxException e) {
            System.out.println(e);  
        }
           catch (MalformedJsonException e) {
            System.out.println(e);  
        }
         catch (ArrayIndexOutOfBoundsException e) {
            e.printStackTrace();
            System.out.println(e);  
        }
           catch (IllegalStateException e) {
            e.printStackTrace();
            System.out.println(e);  
        }
        catch(IOException e){
            e.printStackTrace();
             System.out.println(e); 
        }
        catch (Exception e) {
            e.printStackTrace();
          System.out.println(e.getMessage());  
        } 
    }
static class   BZip2Archive{
    @SerializedName("fieldname")
    public String fieldName;

    @SerializedName("originalname")
    public String originalName;

    @SerializedName("encoding")
    public String encoding;

    @SerializedName("mimetype")
    public String mimeType;

    @SerializedName("destination")
    public String destination;

    @SerializedName("filename")
    public String filename;

    @SerializedName("path")
    public String path;

    @SerializedName("size")
    public long size;
}
}



