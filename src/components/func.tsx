import {BsCircle} from 'react-icons/bs';
import {TbCircleDotted} from 'react-icons/tb';
import {BsCircleHalf} from 'react-icons/bs';
import {AiFillCheckCircle} from 'react-icons/ai';
import {MdCancel} from 'react-icons/md';
import {BiDotsHorizontal} from 'react-icons/bi';
import {BsFillExclamationSquareFill} from 'react-icons/bs';
import {PiCellSignalFullFill} from 'react-icons/pi';
import {PiCellSignalMediumFill} from 'react-icons/pi';
import {PiCellSignalLowFill} from 'react-icons/pi';

export const GetPriorityLabel = (priority: number): string => {
    switch (priority) {
      case 4:
        return 'Urgent';
      case 3:
        return 'High';
      case 2:
        return 'Medium';
      case 1:
        return 'Low';
      case 0:
        return 'No priority';
      default:
        return '';
    }
  };

export  const GetPriorityIcon = (priority: number | string)=> {
    switch (priority) {
      case 4  :
        return <BsFillExclamationSquareFill style={{ color: 'orange' }}/>;
      case 'Urgent'  :
        return <BsFillExclamationSquareFill style={{ color: 'orange' }}/>;
      case 3:
        return <PiCellSignalFullFill style={{ color: 'grey' }}/>;
      case 'High':
        return <PiCellSignalFullFill style={{ color: 'grey' }}/>;
      case 2:
        return <PiCellSignalMediumFill style={{ color: 'grey' }}/>;
      case 'Medium':
        return <PiCellSignalMediumFill style={{ color: 'grey' }}/>;
      case 1:
        return <PiCellSignalLowFill style={{ color: 'grey' }}/>;
      case 'Low':
        return <PiCellSignalLowFill style={{ color: 'grey' }}/>;
      case 0:
        return <BiDotsHorizontal style={{ color: 'grey' }}/>;
      case 'No priority':
        return <BiDotsHorizontal style={{ color: 'grey' }}/>;
      default:
        return <></>;
    }
  };

export  const GetStatusIcon = (priority: string)=> {
    switch (priority) {
      case 'Backlog':
        return <TbCircleDotted style={{ color: 'grey' }}/>;
      case 'Todo':
        return <BsCircle style={{ color: 'grey' }}/>;
      case 'In progress':
        return <BsCircleHalf style={{ color: '#FEDE00' }}/>;
      case 'Completed':
        return <AiFillCheckCircle style={{ color: 'green' }} />;
      case 'Cancelled':
        return <MdCancel style={{ color: 'grey' }}/>;
      default:
        return <></>;
    }
  };