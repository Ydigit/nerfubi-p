import open3d as o3d
import numpy as np

pcd = o3d.io.read_point_cloud("meshes/L.ply")

# Corrigir Z invertido nos pontos (só se necessário)
points = np.asarray(pcd.points)
points[:, 2] *= -1
pcd.points = o3d.utility.Vector3dVector(points)

# Escalar e centralizar
pcd.scale(10.0, center=pcd.get_center())

# Visualização
vis = o3d.visualization.Visualizer()
vis.create_window()
vis.add_geometry(pcd)

view_ctl = vis.get_view_control()

center = pcd.get_center()
bbox = pcd.get_axis_aligned_bounding_box()
extent = bbox.get_extent()
diagonal = np.linalg.norm(extent)

view_ctl.set_lookat(center)

#  Agora com Z invertido (olha de cima com Z positivo)
view_ctl.set_front([-1, -4.4, 6.0])
view_ctl.set_up([0.5, 2.5, 1.0])

view_ctl.set_zoom(1.0 / diagonal * 40)

vis.run()
vis.destroy_window()
