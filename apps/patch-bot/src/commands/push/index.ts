import { logger } from '../../logger';
import { updateMemberNotificationFlag } from '../../queries/updateMemberNotificationFlag';
import { AppState } from '../../state';
import { PushCommandStatus, Self } from '../../types';

type Param = {
  user: Self | null;
  status: PushCommandStatus;
};

export const push = async ({ user, status }: Param, state: AppState) => {
  if (!user) {
    logger.log('Member not found');
    return "Non hai l'autorizzazione necessaria per lanciare questo comando";
  }

  switch (status) {
    case 'on': {
      if (!user.notifications) {
        const updateResult = await updateMemberNotificationFlag(
          {
            id: user._id,
            value: true,
          },
          state
        );

        if (updateResult) {
          return 'Le notifiche sono state ATTIVATE con successo 🚀';
        }

        return "C'è stato un errore imprevisto, riprova più tardi";
      }

      return 'Le notifiche sono già attive';
    }
    case 'off': {
      if (user.notifications) {
        const disableNotificationResult = await updateMemberNotificationFlag(
          {
            id: user._id,
            value: false,
          },
          state
        );

        if (disableNotificationResult) {
          return 'Le notifiche sono state DISATTIVATE con successo';
        }

        return "C'è stato un errore imprevisto, riprova più tardi";
      }

      return 'Le notifiche sono già disattivate';
    }
    default: {
      return 'Valore non valido, lo status può essere solo on oppure off';
    }
  }
};
