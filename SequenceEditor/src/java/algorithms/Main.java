/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package algorithms;

import org.biojavax.SimpleNamespace;
import org.biojava.bio.symbol.SymbolList;
import org.biojava.bio.seq.*;
import org.biojavax.bio.seq.SimpleRichSequence;

/**
 *
 * @author Henry
 */
public class Main {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {

        String forwardOligoSeq;
        String reverseOligoSeq;
        SymbolList forwardOligoSymList = null;
        SymbolList reverseOligoSymList = null;
        String resultText;
        //Initiation block from servlet code
        try {
            forwardOligoSeq = "TATCTTTACAGCTAGCTCAGTCCTAGGGACTGTGCTAGC";
            reverseOligoSeq = "CAAAGCTAGCACAGTCCCTAGGACTGAGCTAGCTGTAAA";

            forwardOligoSymList = DNATools.createDNA(forwardOligoSeq);
            reverseOligoSymList = DNATools.createDNA(reverseOligoSeq);
            SimpleRichSequence forwardOligo = new SimpleRichSequence(new SimpleNamespace("org.biofab"), "", "", 1, forwardOligoSymList, 1.0);
            SimpleRichSequence reverseOligo = new SimpleRichSequence(new SimpleNamespace("org.biofab"), "", "", 1, forwardOligoSymList, 1.0);
            Annealer AnnealerObject = new Annealer();
            resultText = AnnealerObject.anneal(forwardOligo, reverseOligo);

            System.out.println(resultText);
        } catch (Exception e) {
            System.out.println("Error occurred");
            e.getMessage();
        }
    }
}
