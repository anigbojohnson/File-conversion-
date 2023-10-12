import org.apache.commons.compress.archivers.*;
import org.apache.commons.compress.archivers.cpio.CpioArchiveInputStream;
import org.apache.commons.compress.utils.IOUtils;
import java.io.*;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import java.util.ArrayList;
import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.ExecuteException;
import org.apache.commons.exec.PumpStreamHandler;

import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.MalformedJsonException;


public class CPIO {
    public static void main(String[] args) { 
        System.out.println("your path: for this file");
        try {
          String dirPath = "change-file-type-main\\change_file_type\\controller\\pythonProject\\CPIOToZip.py"; 
       
          ArrayList<String> cpioFileList = new ArrayList<>();
          ArrayList<String> extractedCpioFileList = new ArrayList<>();
         
            File extractDir;
            Gson gson = new Gson();
          CpioArchive[] cpioArchive = gson.fromJson(args[0], CpioArchive[].class);
            for ( CpioArchive  CpioArchiveFile : cpioArchive) {
                try (
                 BufferedInputStream bis = new BufferedInputStream(new FileInputStream((new File("uploads"+File.separator+CpioArchiveFile.path)).getAbsolutePath()));
                 ArchiveInputStream ais = new CpioArchiveInputStream(bis);
               ) {
                extractDir = new File(("change-file-type-main"+File.separator+"change_file_type"+File.separator+"intermediary" +File.separator+CpioArchiveFile.originalName.split("\\.")[0]+'_'+CpioArchiveFile.path));
                String extractAbs= extractDir.getAbsolutePath();
                extractDir = new File(extractAbs);
                extractedCpioFileList.add(extractAbs);
                cpioFileList.add("change-file-type-main"+File.separator+"change_file_type"+File.separator+"uploads"+File.separator+CpioArchiveFile.path.split("\\.")[0]);
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
       
          CommandLine cmdLine = new CommandLine("python"); 
          cmdLine.addArgument(dirPath); 
            DefaultExecutor executor = new DefaultExecutor(); 
            cmdLine.addArgument(extractedCpioFileList.toString()); // Add the first value as an argument  
            cmdLine.addArgument(cpioFileList.toString()); 
            // Create a PumpStreamHandler to capture both stdout and stderr

        // Set the stream handler for the executor
      /* 

         int exitValue = executor.execute(cmdLine); 
            if(exitValue!=0){
                  System.out.println("This is the exit value "+exitValue);
            }
      */   

      
            System.out.println("CPIO archive extracted successfully.");
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
static class  CpioArchive{
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


