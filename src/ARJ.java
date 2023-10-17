import org.apache.commons.compress.archivers.*;
import org.apache.commons.compress.archivers.ar.ArArchiveInputStream;
import org.apache.commons.compress.archivers.arj.ArjArchiveInputStream;
import org.apache.commons.compress.utils.IOUtils;
import java.io.*;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import java.util.ArrayList;
import org.apache.commons.exec.ExecuteException;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.MalformedJsonException;

public class ARJ {
    public static void main(String[] args) { 
        try {          
       
         
            File extractDir;
            Gson gson = new Gson();
          ARJArchive[] arjArchive = gson.fromJson(args[0],  ARJArchive[].class);
            for ( ARJArchive arjArchiveFile : arjArchive ){
                try (
                 BufferedInputStream bis = new BufferedInputStream(new FileInputStream((new File("uploads"+File.separator+arjArchiveFile.path)).getAbsolutePath()));
                 ArArchiveInputStream ais = new ArArchiveInputStream(new ArjArchiveInputStream(bis));
               ) {
                extractDir = new File(("intermediary" +File.separator+arjArchiveFile.originalName.split("\\.")[0]+'_'+arjArchiveFile.path.split("\\.")[0]));
                String extractAbs= extractDir.getAbsolutePath();
                extractDir = new File(extractAbs);
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
    
        System.out.println("extracted");
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
static class ARJArchive{
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



