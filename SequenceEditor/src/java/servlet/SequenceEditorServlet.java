/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servlet;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author Jenhan Tao <jenhantao@gmail.com>
 */
public class SequenceEditorServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP
     * <code>GET</code> and
     * <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //HANDLE FILE UPLOAD
        if (ServletFileUpload.isMultipartContent(request)) {
            ServletFileUpload uploadHandler = new ServletFileUpload(new DiskFileItemFactory());
            PrintWriter writer = response.getWriter();
            //set content type
            response.setContentType("application/json");
            //after post request redirect to another page
            response.sendRedirect("index.html");

            try {
                List<FileItem> items = uploadHandler.parseRequest(request);
                addFilesToLoad(items);
            } catch (FileUploadException e) {
                throw new RuntimeException(e);
            } catch (Exception e) {
                e.printStackTrace();
                StringWriter stringWriter = new StringWriter();
                PrintWriter printWriter = new PrintWriter(stringWriter);
                e.printStackTrace(printWriter);
                String exceptionAsString = stringWriter.toString().replaceAll("[\r\n\t]+", "<br/>");
                writer.write("{\"result\":\"" + exceptionAsString + "\",\"status\":\"bad\"}");

            } finally {
                writer.close();
            }
        } else {
            //HANDLE REGULAR REQUESTS
            //set response type; basically it's either text or json
//            response.setContentType("text/html;charset=UTF-8");
            response.setContentType("text/json");
            PrintWriter out = response.getWriter();
            //get parameter from client request
            String command = request.getParameter("command");
            try {
                //always use the param command to do servlet method calls
                if (command.equals("test")) {
                    //prints onto the GlassFish Server tab
                    System.out.println("got from client " + request.getParameter("data"));
                    //write content of response
                    out.write("response from the server");
                } else if (command.equals("load")) {
                    String toReturn = loadFiles();
                    out.write(toReturn);
                } else if (command.equals("feature")) {
                    String toReturn = getFeatureFiles();
                    out.write(toReturn);
                } else if (command.equals("align")) {
                    out.write("Align chosen");
                } else if (command.equals("genbank")) {
//                    String toReturn = genbankParser();
                    JSONArray toReturn = genbankParser();
                    out.print(toReturn);
                } else if (command.equals("save")) {
                    out.write("Save chosen");
                }

            } finally {
                out.close();
            }
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    private String loadFiles() {
        String filePath = this.getServletContext().getRealPath("/") + "data/sequences/";
        //find all files at filePath
        File[] filesInDirectory = new File(filePath).listFiles();
        String toReturn = "";
        try {
            for (File currentFile : filesInDirectory) {
                BufferedReader reader = new BufferedReader(new FileReader(currentFile.getAbsolutePath()));
                String line = reader.readLine();
                while (line != null) {
                    toReturn = toReturn + "<br>" + line;
                    line = reader.readLine();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR";
        }
        return toReturn;
    }

    // Parse Genbank files already uploaded to database.
    private JSONArray genbankParser() {
        String filePath = this.getServletContext().getRealPath("/") + "data/genbank/";
        File[] filesInDirectory = new File(filePath).listFiles();
        String toReturn = "";
        String sequence = "";
        JSONArray genbankInfo = new JSONArray();
        try {
            for (File currentFile : filesInDirectory) {
                // Read through file once to store entire sequence.
                BufferedReader reader = new BufferedReader(new FileReader(currentFile.getAbsolutePath()));
                String line = reader.readLine();
                while (line != null) {
                    JSONObject genbankObject = new JSONObject();
                    if (line.startsWith("ORIGIN")) {
                        line = reader.readLine().trim();
                        while (!(line.startsWith("//"))) {
                            ArrayList<String> seq = new ArrayList(Arrays.asList(line.split(" ")));
                            for (int i = 1; i < seq.size(); i++) {
                                sequence = sequence + seq.get(i);
                            }
                            line = reader.readLine().trim();
                        }
                        genbankObject.put("Sequence", sequence);
                        genbankInfo.add(genbankObject);
                    } else {
                        line = reader.readLine();
                    }
                }
                // Restart at head of file now that sequence is stored. Read in features one by one.
                BufferedReader readerTwo = new BufferedReader(new FileReader(currentFile.getAbsolutePath()));
                String lineTwo = readerTwo.readLine();
                ArrayList<String> features = new ArrayList();
                while (lineTwo != null) {
                    String indeces = "";
                    String featureSeq = "";
                    if (lineTwo.startsWith("FEATURES")) {
                        lineTwo = readerTwo.readLine().trim();
                        while (!(lineTwo.startsWith("ORIGIN"))) {
                            if (!(lineTwo.startsWith("//")) && !(lineTwo.startsWith("SOURCE"))) {
                                if (lineTwo.startsWith("misc_feature")) {
                                    indeces = lineTwo.replaceAll("misc_feature", "");
                                    indeces = indeces.trim();
                                    String[] splitIndeces = indeces.split("\\..");
                                    featureSeq = sequence.substring(Integer.parseInt(splitIndeces[0])-1, Integer.parseInt(splitIndeces[1]));
                                    features.add(featureSeq);
                                } else if (lineTwo.startsWith("/label=")) {
                                    features.add(lineTwo.replaceAll("/label=", ""));
                                }
                            }
                            lineTwo = readerTwo.readLine().trim();
                        }
                    }
                    lineTwo = readerTwo.readLine();
                }
                for (int ii = 0; ii < features.size(); ii++) {
                    JSONObject genbankObject = new JSONObject();
                    genbankObject.put(features.get(ii + 1), features.get(ii));
                    genbankInfo.add(genbankObject);
                    ii++;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
//            return "ERROR";
        }
//        toReturn = genbankInfo.toString();
        return genbankInfo;
    }

    // Method written to practice working with client-server communication. Reads only fabricated files.
    private String getFeatureFiles() {
        JSONArray arrayOfFeatures = new JSONArray();
        String filePath = this.getServletContext().getRealPath("/") + "data/featureFiles/";
        File[] filesInDirectory = new File(filePath).listFiles();
        String toReturn = "";
        try {
            for (File currentFile : filesInDirectory) {
                BufferedReader reader = new BufferedReader(new FileReader(currentFile.getAbsolutePath()));
                String line = reader.readLine();
                while (line != null) {
                    JSONObject features = new JSONObject();
                    String[] fields = line.split(",");
                    for (int ii = 0; ii < 3; ii++) {
                        System.out.println(fields[ii]);
                        if (ii == 0) {
                            features.put("name", fields[ii]);
                        } else if (ii == 1) {
                            features.put("sequence", fields[ii]);
                        } else if (ii == 2) {
                            features.put("color", fields[ii]);
                        }
                    }
                    line = reader.readLine();
                    arrayOfFeatures.add(features);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR";
        }
        toReturn = arrayOfFeatures.toString();
        System.out.println(toReturn);
        return toReturn;
    }

    private void addFilesToLoad(List<FileItem> items) {
        String uploadSeqFilePath = this.getServletContext().getRealPath("/") + "/data/sequences/";
        String uploadFeatureFilePath = this.getServletContext().getRealPath("/") + "/data/featureFiles/";
        String uploadGenbankFilePath = this.getServletContext().getRealPath("/") + "/data/genbank/";
        ArrayList<File> toLoad = new ArrayList();
        for (FileItem item : items) {
            File file;
            if (!item.isFormField()) {
                String fileName = item.getName();
                if (fileName.equals("")) {
                    System.out.println("You forgot to choose a file.");
                }
                if (fileName.lastIndexOf("\\") >= 0) {
                    if (fileName.contains(".ff")) {
                        file = new File(uploadFeatureFilePath + fileName.substring(fileName.lastIndexOf("\\")));
                    } else if (fileName.contains(".str")) {
                        file = new File(uploadGenbankFilePath + fileName.substring(fileName.lastIndexOf("\\")));
                    } else {
                        file = new File(uploadSeqFilePath + fileName.substring(fileName.lastIndexOf("\\")));
                    }
                } else {
                    if (fileName.contains(".ff")) {
                        file = new File(uploadFeatureFilePath + fileName.substring(fileName.lastIndexOf("\\") + 1));
                    } else if (fileName.contains(".str")) {
                        file = new File(uploadGenbankFilePath + fileName.substring(fileName.lastIndexOf("\\") + 1));
                    } else {
                        file = new File(uploadSeqFilePath + fileName.substring(fileName.lastIndexOf("\\") + 1));
                    }
                }
                try {
                    item.write(file);
                } catch (Exception ex) {
                    Logger.getLogger(SequenceEditorServlet.class.getName()).log(Level.SEVERE, null, ex);
                }
                toLoad.add(file);
            }
        }
    }
}
