import logo from './logo.svg';
import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import useCustomFetch from './hooks/useCustomFetch';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function App() {
  const [page, setPage] = useState(1);
  const { loading, error, gitData } = useCustomFetch(page);
  const loader = useRef(null);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  function difference(date) {
    const created = new Date(date);
    const diff = new Date().getTime() - created.getTime();

    return Math.floor(diff / (1000 * 3600 * 24));
  }

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const renderTooltip = (props, title) => (
    <Tooltip {...props}>{title}</Tooltip>
  );


  return (
    <div className="App">
      <div className='list-group w-75 m-auto'>
        {gitData.map((data, i) => (
          <div className="list-group-item d-flex" key={i}>
            <div className="flex-shrink-0 pt-2 pl-3">
              <svg className="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill="#1a7f37" d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fill="#1a7f37" fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path></svg>
            </div>
            <div className='flex-auto text-left p-2 pr-3 pr-md-2'>
              <a className="bold text" href={data.html_url}>
                {data.title}
              </a>
              {
                data.labels.map(label => {
                  return (label.description ?
                    <OverlayTrigger key={label.id} placement="bottom" overlay={(props) => renderTooltip(props, label.description)}>
                      <div className="d-inline-flex label m-1 p-1"
                        style={{ background: "#" + label.color }}>
                        {label.name}
                      </div>
                    </OverlayTrigger> : <div  key={label.id} className="d-inline-flex label m-1 p-1"
                      style={{ background: "#" + label.color }}>
                      {label.name}
                    </div>
                  )
                })
              }
              <div className="d-flex mt-1 text-small color-muted">
                #{data.number} opened {difference(data.created_at)} days ago by {data.user.login}

              </div>
            </div>
            <div className="flex-shrink-0 col-2 pt-2 text-right pr-3 no-wrap d-flex ">
              <span className="ml-2 flex-1 flex-shrink-0">
                {data?.assignee && <img src={data?.assignee?.avatar_url} height="20" width="20" alt={data?.assignee?.login}></img>}
              </span>
              <span className="ml-2 flex-1 flex-shrink-0">
                {data.comments != 0 && (<a className='text' href={data.html_url}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                </svg> {data.comments}</a>)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error!</p>}
      <div ref={loader} />
    </div>
  );
}

export default App;
