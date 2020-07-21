import React, { useEffect, useState } from 'react';
import { useApiSurvivor, IReport } from '../../hooks/ApiProvider';
import { Container, WrapperText, Label } from './styles';

const Dashboard: React.FC = () => {
  const [report, setReport] = useState<IReport>({} as IReport);
  const [flag, setFlag] = useState(false);

  const { getReports } = useApiSurvivor();

  useEffect(() => {
    getReports().then(data => {
      setReport(data);
      setFlag(true);
    });
  }, [getReports]);

  return (
    <Container>
      <WrapperText show={flag}>
        <Label show={flag} value={report.average_healthy}>
          Total healthy:
        </Label>
        <Label show={flag} value={report.average_infected}>
          Total infected:
        </Label>
        <Label show={flag} value={report.total_points_lost}>
          Total points lost:
        </Label>
        <Label
          show={flag}
          value={report.average_items_quantity_per_healthy_person}
        >
          Average items quantity per healthy person:
        </Label>
        <WrapperText show={flag}>
          <Label
            show={flag}
            value={
              report.average_quantity_of_each_item_per_person?.['Fiji Water'] ||
              '0'
            }
          >
            Fiji Water per person:
          </Label>

          <Label
            show={flag}
            value={
              report.average_quantity_of_each_item_per_person?.[
                'Campbell Soup'
              ] || '0'
            }
          >
            Campbell Soup per person:
          </Label>

          <Label
            show={flag}
            value={
              report.average_quantity_of_each_item_per_person?.[
                'First Aid Pouch'
              ] || '0'
            }
          >
            First Aid Pouch per person:
          </Label>

          <Label
            show={flag}
            value={report.average_quantity_of_each_item_per_person?.AK47 || '0'}
          >
            AK47 per person:
          </Label>
        </WrapperText>
      </WrapperText>
    </Container>
  );
};

export default Dashboard;
