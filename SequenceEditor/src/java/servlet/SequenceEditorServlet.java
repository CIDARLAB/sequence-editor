/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servlet;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

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
            response.setContentType("text/plain");
            //after post request redirect to another page
            response.sendRedirect("index.html");
            try {
                List<FileItem> items = uploadHandler.parseRequest(request);
                //get relative file path
                String uploadFilePath = this.getServletContext().getRealPath("/") + "/data/";
                ArrayList<File> toLoad = new ArrayList();
                for (FileItem item : items) {
                    File file;
                    if (!item.isFormField()) {
                        String fileName = item.getName();
                        if (fileName.equals("")) {
                            System.out.println("You forgot to choose a file.");
                        }
                        if (fileName.lastIndexOf("\\") >= 0) {
                            file = new File(uploadFilePath + fileName.substring(fileName.lastIndexOf("\\")));
                        } else {
                            file = new File(uploadFilePath + fileName.substring(fileName.lastIndexOf("\\") + 1));
                        }
                        item.write(file);
                        toLoad.add(file);
                    }
                }
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
            response.setContentType("text/html;charset=UTF-8");
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
                    out.write("Upload feature file chosen");
                } else if (command.equals("align")) {
                    out.write("Align chosen");
                } else if (command.equals("genbank")) {
                    out.write("Upload Genbank file chosen");
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
        String filePath = this.getServletContext().getRealPath("/") + "data/";
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
}
