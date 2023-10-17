
import org.apache.commons.compress.archivers.*;
import org.apache.commons.compress.archivers.ar.ArArchiveInputStream;
import org.apache.commons.compress.compressors.z.ZCompressorInputStream;
import org.apache.commons.compress.utils.IOUtils;
import java.io.*;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import java.util.ArrayList;
import org.apache.commons.exec.ExecuteException;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.MalformedJsonException;
public class Z {

    public static void main(String[] args) { 
        try {          
       
          ArrayList<String> extractedZFileList = new ArrayList<>();
         
            File extractDir;
            Gson gson = new Gson();
          ZArchive[] zArchive = gson.fromJson(args[0],  ZArchive[].class);
            for ( ZArchive zArchiveFile : zArchive ){
                try (
                 BufferedInputStream bis = new BufferedInputStream(new FileInputStream((new File("uploads"+File.separator+zArchiveFile.path)).getAbsolutePath()));
                 ArArchiveInputStream ais = new ArArchiveInputStream(new ZCompressorInputStream(bis));
               ) {
                extractDir = new File(("intermediary" +File.separator+zArchiveFile.originalName.split("\\.")[0]+'_'+zArchiveFile.path.split("\\.")[0]));
                String extractAbs= extractDir.getAbsolutePath();
                extractDir = new File(extractAbs);
                extractedZFileList.add(extractAbs);
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
    
        System.out.println(gson.toJson(extractedZFileList));
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
static class   ZArchive{
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
