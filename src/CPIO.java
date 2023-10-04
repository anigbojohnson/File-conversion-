import org.apache.commons.compress.archivers.*;
import org.apache.commons.compress.archivers.cpio.CpioArchiveInputStream;
import org.apache.commons.compress.utils.IOUtils;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.List;




public class CPIO {
    public static void main(String[] args) {
        String cpioArchivePath =   "C:\\Users\\hp user\\Downloads\\CabArchive-master.cpio";
        String extractionPath =  "C:\\Users\\hp user\\Downloads\\CabArchive-masr";

        try {
          
            File extractDir = new File(extractionPath);
            List<String> command = List.of("python", "CPIOToZip.py");
            String filePath = "change-file-type-main"+File.separator+"change_file_type"+File.separator+"controller"+File.separator+"pythonProject"
            +File.separator+"CPIOToZip.py";
         //   String path = file.getPath();
         Path path = Paths.get(filePath);

         // Get the parent directory's path
         Path parentPath = path.getParent();
        // String absolutePath = path.toAbsolutePath().toString();
             ProcessBuilder processBuilder = new ProcessBuilder(command);
             processBuilder.directory( new File(parentPath.toString()));
          Process process = processBuilder.start();
          OutputStream outputStream = process.getOutputStream();

            try (
                 BufferedInputStream bis = new BufferedInputStream(new FileInputStream(new File(cpioArchivePath)));
                 ArchiveInputStream ais = new CpioArchiveInputStream(bis);
                Writer writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)) {

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
            writer.write(extractionPath);
            writer.write(";");
            writer.write(cpioArchivePath);

            InputStream errorStream = process.getErrorStream();
BufferedReader errorReader = new BufferedReader(new InputStreamReader(errorStream));
String errorLine;
while ((errorLine = errorReader.readLine()) != null) {
    System.err.println("Error: " + errorLine);
}

            if (process.waitFor() != 0) {
                System.err.println("Error while extracting CPIO archive");
                System.exit(1);
            }
            } 
   
            System.out.println("CPIO archive extracted successfully.");
        } catch (IOException | InterruptedException e ) {
            e.printStackTrace();
            System.err.println("Error extracting CPIO archive.");
        }
    }

}
