///////////////////////// imp code to get link with Id in mail ///////////////////////////////////
Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
String[] toAddresses = new String[] {

    'tejpalkumawat1991@gmail.com' //your email id
};
mail.setToAddresses(toAddresses);
mail.setSubject('Some subject');
String mailBody = 'Link: ' + URL.getSalesforceBaseUrl().toExternalForm() + '/' + customObjId;
mail.setPlainTextBody(mailBody);
Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });


//////////////////////////////////////////////////////////////////
trigger ContactTrigger on Contact(after insert) {
    if (Trigger.isInsert & Trigger.isAfter) {
        ContactTriggerHandler.sendEmailNotification(Trigger.new);
    }
}

public class ContactTriggerHandler {
    public static void sendEmailNotification(List<Contact> conList) {
    List < Messaging.Email > emailList new List < Nessaging.Email > ();
    for (Contact con:conList) {
        if (con.Email != null) {
            Messaging.singleEmailMessage emailMsg new Messaging.singleEmailMessage();
            String[] toAddress new String[]{
                con.Email);
                emailMsg.setToAddresses(toAddress);
    String emailSub = 'Welcome' + con.FirstName;
                emai1Msg.setSubject(emailSub);
    String content = 'Hi' + con.FirstName +
                    emaiMsg.setHtmlBody(content);
                emailList.add(emailMsg);
            }
        }
        Messaging.sendEmail(emailList);
    }
}


//////  working mail trigger (u learn how to use link in mail of record and MOST IMPORTAT HOW TO GET DATA FROM CUSTOM SETTING)  //////////////////
trigger testmail on Interview__c(after insert, after update) {

    //Create a master list to hold the emails we'll send

    List < Messaging.SingleEmailMessage > mails = new List < Messaging.SingleEmailMessage > ();
    for (Interview__c s : Trigger.new) {
        if (s.Feedback_given__c == true) {

            map < Id, string > allmails = new map < Id, string > ();
            List < Interview__c > allinterviews =[SELECT Id, Application_Detail__c, Interviewer_Name__c FROM Interview__c Where Application_Detail__c =: s.Application_Detail__c];
            Application_Details__c canDetails = [SELECT Id, Candidate__r.Name, Candidate__r.Mobile__c  FROM Application_Details__c WHERE Id =: s.Application_Detail__c];
            system.debug('canDetails' + canDetails);
            Candidate__c can = [SELECT Mobile__c, Expected_CTC__c, Highest_Qualification__c, Ready_to_relocate__c, Notice_Period__c, Email__c FROM Candidate__c WHERE Name =: canDetails.Candidate__r.Name];
            system.debug('can' + can);

            for (Interview__c name : allinterviews) {
                allmails.put(name.Id, name.Interviewer_Name__c);
            }

            system.debug('app' + allmails);

            set < Id > allId = allmails.keySet();

            for (Id  newId: allId) {
            Interview__c allintervie = [SELECT Id, Application_Detail__r.Current_Interview_Round__c, Feedback_given__c, Interviewer_Name__c, Name, Interview_Status__c, Interview_Type__c, Total_Interview_Rounds__c  FROM Interview__c WHERE Id =: newId];

                //Create a new Email
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                //Set list of people who should get the email
                List < String > sendTo = new List < String > ();
                
                  Interviewer_Details__c interviewer;
                if (String.isNotBlank(allintervie.Interviewer_Name__c)) {
                    interviewer = Interviewer_Details__c.getInstance(allintervie.Interviewer_Name__c);
                }
                if (String.isNotBlank(interviewer.Email__c)) {
                    sendTo.add(interviewer.Email__c);
                }
                mail.setToAddresses(sendTo);
                //Set who the email is sent from
                mail.setReplyTo('siddesh.bauchkar@excellerconsultancy.in');
                mail.setSenderDisplayName('exceller consultancy');

                // Set email contents - you can use variables!
                mail.setSubject('Subject Content');
            String body = 'feed back form' + '\n\r' + '<br/>';
                body += 'Link: ' + URL.getSalesforceBaseUrl().toExternalForm() + '/' + allintervie.Id + '<br/>';
                body += 'Application ld : ' + allintervie.Application_Detail__c + '<br/>';
                //    body += 'Current Interview Round  c: '+allintervie.Current_Interview_Round__c +'<br/>';
                body += 'Feedbackgiven : ' + allintervie.Feedback_given__c + '<br/>';
                body += 'Interview Name: ' + allintervie.Name + '<br/>';
                body += 'Interview Status : ' + allintervie.Interview_Status__c + '<br/>';
                body += 'Interview Type : ' + allintervie.Interview_Type__c + '<br/>';
                body += 'Interviewer Name : ' + allintervie.Interviewer_Name__c + '<br/>';
                body += 'Total Interview Rounds : ' + allintervie.Total_Interview_Rounds__c + '<br/>';
                body += 'Candidate Name : ' + canDetails.Candidate__r.Name + '<br/>';
                body += 'Candidate Mobile : ' + can.Mobile__c + '<br/>';
                body += 'Candidate Expected CTC : ' + can.Expected_CTC__c + '<br/>';
                body += 'Candidate Highest Qualification : ' + can.Highest_Qualification__c + '<br/>';
                body += 'Candidate Ready to relocate : ' + can.Ready_to_relocate__c + '<br/>';
                body += 'Candidate Notice Period : ' + can.Notice_Period__c + '<br/>';
                body += 'Candidate Email : ' + can.Email__c + '<br/>';

                mail.setHtmlBody(body);

                //Add your email to the master list
                mails.add(mail);
            }
            // Send all emails in the master list
            Messaging.sendEmail(mails);


        }
    }



}

/////////////////////////////////     latest email trigger     /////////////////////////////////////////////////
trigger testmail on Interview__c(after insert, after update) {
    /*    custom settings code (to get data from custom setting)
         Interviewer_Details__c interviewer;
                    if(String.isNotBlank(allintervie.Interviewer_Name__c)){
                   interviewer = Interviewer_Details__c.getInstance(allintervie.Interviewer_Name__c);
               }
                    if(String.isNotBlank(interviewer.Email__c)){
                   sendTo.add(interviewer.Email__c);                    
               }
      */
    List < Messaging.SingleEmailMessage > mails = new List < Messaging.SingleEmailMessage > ();

    for (Interview__c s : Trigger.new) {
        if (s.Feedback_given__c == true) {
            List < String > sendTo = new List < String > ();
            set < string > allmails = new set < string > ();
            List < Interview__c > allinterviews =[SELECT Id, Application_Detail__c, Interviewer_Name__c FROM Interview__c Where Application_Detail__c =: s.Application_Detail__c];

            for (Interview__c name : allinterviews) {
                allmails.add(name.Interviewer_Name__c);
            }

            for (string interviewermail : allmails) {
                   Interviewer_Details__c interviewer;
                if (String.isNotBlank(interviewermail)) {
                    interviewer = Interviewer_Details__c.getInstance(interviewermail);
                }
                if (String.isNotBlank(interviewer.Email__c)) {
                    sendTo.add(interviewer.Email__c);
                }
            }
               
                Application_Details__c canDetails = [SELECT Id, Candidate__r.Name, Candidate__r.Mobile__c  FROM Application_Details__c WHERE Id =: s.Application_Detail__c];
                Candidate__c can = [SELECT Mobile__c, Expected_CTC__c, Highest_Qualification__c, Ready_to_relocate__c, Notice_Period__c, Email__c FROM Candidate__c WHERE Name =: canDetails.Candidate__r.Name];

            //Create a new Email
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();



            mail.setToAddresses(sendTo);
            //Set who the email is sent from
            mail.setReplyTo('siddesh.bauchkar@excellerconsultancy.in');
            mail.setSenderDisplayName('exceller consultancy');

            // Set email contents - you can use variables!
            mail.setSubject('Subject Content');
               String body = 'feed back form' + '\n\r' + '<br/>';
            body += 'Link: ' + URL.getSalesforceBaseUrl().toExternalForm() + '/' + s.Id + '<br/>';
            body += 'Application ld : ' + s.Application_Detail__c + '<br/>';
            //    body += 'Current Interview Round  c: '+allintervie.Current_Interview_Round__c +'<br/>';
            body += 'Feedbackgiven : ' + s.Feedback_given__c + '<br/>';
            body += 'Interview Name: ' + s.Name + '<br/>';
            body += 'Interview Status : ' + s.Interview_Status__c + '<br/>';
            body += 'Interview Type : ' + s.Interview_Type__c + '<br/>';
            body += 'Interviewer Name : ' + s.Interviewer_Name__c + '<br/>';
            body += 'Total Interview Rounds : ' + s.Total_Interview_Rounds__c + '<br/>';
            body += 'Candidate Name : ' + canDetails.Candidate__r.Name + '<br/>';
            body += 'Candidate Mobile : ' + can.Mobile__c + '<br/>';
            body += 'Candidate Expected CTC : ' + can.Expected_CTC__c + '<br/>';
            body += 'Candidate Highest Qualification : ' + can.Highest_Qualification__c + '<br/>';
            body += 'Candidate Ready to relocate : ' + can.Ready_to_relocate__c + '<br/>';
            body += 'Candidate Notice Period : ' + can.Notice_Period__c + '<br/>';
            body += 'Candidate Email : ' + can.Email__c + '<br/>';

            mail.setHtmlBody(body);

            //Add your email to the master list
            mails.add(mail);
        }
        Messaging.sendEmail(mails);

    }
}