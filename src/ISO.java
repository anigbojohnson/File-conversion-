import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.utils.IOUtils;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import net.sf.sevenzipjbinding.ExtractOperationResult;

import net.sf.sevenzipjbinding.impl.RandomAccessFileInStream;
import net.sf.sevenzipjbinding.IInArchive;
import net.sf.sevenzipjbinding.SevenZip;
import net.sf.sevenzipjbinding.SevenZipException;
import net.sf.sevenzipjbinding.impl.RandomAccessFileInStream;
import net.sf.sevenzipjbinding.impl.RandomAccessFileOutStream;
import net.sf.sevenzipjbinding.simple.ISimpleInArchive;
import net.sf.sevenzipjbinding.simple.ISimpleInArchiveItem;

public class ISO {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Usage: java ListItemsSimple <archive-name>");
            return;
        }
        RandomAccessFile randomAccessFile = null;
        IInArchive inArchive = null;
        File file;
         ISimpleInArchive simpleInArchive;
        try {
            File extractDir;
            Gson gson = new Gson();
            ArchiveEntry entry;
            Archive[] aArchive = gson.fromJson(args[0],   Archive[].class);
            for ( Archive aArchiveFile : aArchive ){
           // BufferedInputStream bis = new BufferedInputStream(new FileInputStream((new File("uploads"+File.separator+aArchiveFile.path)).getAbsolutePath()));
            extractDir = new File(("intermediary" +File.separator+aArchiveFile.originalName.split("\\.")[0]+'_'+aArchiveFile.path.split("\\.")[0]));
            String extractAbs= extractDir.getAbsolutePath();
            extractDir = new File(extractAbs);
            extractDir.mkdirs();

            randomAccessFile = new RandomAccessFile(new File("uploads"+File.separator+aArchiveFile.path).getAbsolutePath(), "r");
            inArchive = SevenZip.openInArchive(null, // autodetect archive type
                    new RandomAccessFileInStream(randomAccessFile));

            // Getting simple interface of the archive inArchive
            simpleInArchive = inArchive.getSimpleInterface();
            for (ISimpleInArchiveItem item : simpleInArchive.getArchiveItems()) {
                    file = new File(extractDir, item.getPath());
                    if (item.isFolder()) {
                        file.mkdirs();
                    } else {
                    long size = item.getSize();
                    byte[] content = new byte[(int)size];
                     ExtractOperationResult result = item.extractSlowData(new RandomAccessFileOutStream(extractDir),content);     
                }
            }
         }
        } catch (Exception e) {
            System.err.println("Error occurs: " + e);
        } finally {
            if (inArchive != null) {
                try {
                    inArchive.close();
                } catch (SevenZipException e) {
                    System.err.println("Error closing archive: " + e);
                }
            }
            if (randomAccessFile != null) {
                try {
                    randomAccessFile.close();
                } catch (IOException e) {
                    System.err.println("Error closing file: " + e);
                }
            }
        }
    }

    static class Archive{
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