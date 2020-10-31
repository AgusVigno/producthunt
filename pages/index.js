import React, {useContext, useState, useEffect} from 'react';
import Layout from '../components/layout/Layout';
import {FirebaseContext} from '../firebase';
import Producto from '../components/layout/Producto';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const {firebase} = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = () => {
      firebase.db.collection('productos').orderBy('creado', 'desc').onSnapshot(manejarSnapshot);
    }
    obtenerProductos();
  }, []);

  function manejarSnapshot(snapshot){
    const productos = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
    setProductos(productos);
  }
  return ( 
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map(producto => (
                <Producto 
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
   );
}
 
export default Home;