//////////////////////////////////  sanjay gupta apex triggers  ctrl+A && CTRL + TAB (for formating in developer console) //////////////////////////////////////

public class Account TriggerHandler {
    public static void beforeInsert (List<Account> newList) {
        for (Account acc : newList) {
            if(acc. Industry != null && acc. Industry == 'Media') {
                acc. Rating = 'Hot'; I
                    }
        }
    }}


trigger Account Trigger on Account(before insert, after insert) {
    if (Trigger.is Insert) {
        if (Trigger.isBefore) {
    Account TriggerHandler.beforeInsert(Trigger.New);
        } else if (Trigger.isAfter) {
            //
        }
    }
}